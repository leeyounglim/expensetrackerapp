export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { decrypt } from "@/lib/imap/encryption";
import { SupabaseClient } from "@supabase/supabase-js";


export async function POST(request:Request) {
  const supabase = await createClient();

  // get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // get credentials from supabase
  const { data: setting, error } = await supabase
  .from("email_sync_settings")
  .select("email, app_password, last_synced_at")
  .eq("user_id", user.id)
  .single(); 

// code to fetch for user's active bank emails: 
const { data: bankData, error: bankError } = await supabase
  .from("email_sync_banks")
  .select(`
    enabled,
    banks ( bank_email )
  `)
  .eq("user_id", user.id)
  .eq("enabled", true);

if (bankError) {
  console.error("Bank Fetch Error:", bankError);
  return NextResponse.json({ error: "Failed to fetch banks" }, { status: 500 });
}

// 2. Flatten the nested JSON structure into a simple array of strings
const activeBankEmails = bankData?.map(b => (b.banks as any)?.bank_email?.toLowerCase()) .filter(Boolean) as string[];

// Result: ["alerts@chase.com", "statements@bofa.com"]
console.log("Active Bank Emails:", activeBankEmails);

  // ADD THIS CONSOLE LOG TO DEBUG:
  if (error || !setting) {
      console.error("Supabase Query Error:", error);
      console.log("Returned Setting:", setting);
      return NextResponse.json({ error: "No email settings found" }, { status: 404 });
  }

  let syncFromDate = new Date();
  if (setting.last_synced_at) {
      syncFromDate = new Date(setting.last_synced_at);
  } else {
      // Default to 7 days ago for first-time sync
      syncFromDate.setDate(syncFromDate.getDate() - 7); 
  }


  // decrypt password
  const password = decrypt(setting.app_password);

  // today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: setting.email,
      pass: password,
    },
    logger: false,
  });

  await client.connect();

  const lock = await client.getMailboxLock("INBOX");
  try {
    const uids = await client.search({ since: syncFromDate });

    if (!uids || uids.length === 0) {
      console.log("No emails today");
      await updateLastSynced(supabase, user.id);
      return NextResponse.json({ fetched: 0 });
    }

    // --- PASS 1: FETCH HEADERS ONLY ---
    // This is incredibly fast and saves huge amounts of server memory
    const matchingUids: number[] = [];
    for await (const msg of client.fetch(uids, { envelope: true })) {
      const senderEmail = msg.envelope?.from?.[0]?.address?.toLowerCase();
      
      // Keep the UID only if the sender matches one of our active bank emails
      if (senderEmail && activeBankEmails.includes(senderEmail)) {
        matchingUids.push(msg.uid);
      }
    }

    if (matchingUids.length === 0) {
        console.log(`Scanned ${uids.length} emails. None were from active banks.`);
        await updateLastSynced(supabase, user.id);
        return NextResponse.json({ fetched: 0, skipped: uids.length });
    }

    // --- PASS 2: FETCH FULL BODY ---
    // Only download the heavy source code for the exact bank emails we found
    console.log(`Downloading full source for ${matchingUids.length} bank emails...`);
    interface PendingReceipt {
          user_id: string;
          imap_uid: number;
          title: string;
          date: string;
          price: string | number | null;
      }
    const pendingReceipts: PendingReceipt[] = [];

    for await (const msg of client.fetch(matchingUids, { source: true, envelope: true }, {uid : true})) {
      if (!msg.source) continue;
      
      const parsed = await simpleParser(msg.source);

      
      
      const textBody = parsed.text || "";
      const emailText = textBody.toLowerCase(); // Standardize to lowercase for easy checking

      // 1. Check for useless notification phrases
      if (emailText.includes("is successful")) {
          console.log("Skipping duplicate success notification");
          continue; // This immediately stops processing this email and moves to the next one!
      }

      console.log("=== MATCH FOUND ===");
      console.log("Subject:", msg.envelope?.subject);
      console.log("From:", msg.envelope?.from?.[0]?.address);
      const amountRegex = /(?:SGD\s*)?\$?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i;      
      const match = textBody.match(amountRegex);
      const guessedAmount = match && match[1] ? match[1].replace(/[^0-9.]/g, '') : "";      
      const rawBankEmail = msg.envelope?.from?.[0].address?.toLowerCase() || "Unknown Bank"
      const cleanBankName = rawBankEmail.includes('@') ? rawBankEmail.split('@')[0] : rawBankEmail;
      const subject = msg.envelope?.subject || "No Subject"

      const formattedTitle = `${cleanBankName} - ${subject}`;

      const pendingReceipt: PendingReceipt = {
          user_id: user.id,
          imap_uid: msg.uid,
          title: formattedTitle,
          date: msg.envelope?.date ? new Date(msg.envelope.date).toISOString() : new Date().toISOString(),
          price: guessedAmount || null
      };
      console.log(pendingReceipt)
      pendingReceipts.push(pendingReceipt);
    }
    if (pendingReceipts.length > 0) {
        const { error: insertError } = await supabase
            .from("pendingReceipts")
            .insert(pendingReceipts);

        if (insertError) {
            console.error("Supabase Insert Error:", insertError);
            // Even if insert fails, we might not want to crash the whole response,
            // but you should log it to figure out what went wrong.
        }
    }
    await updateLastSynced(supabase, user.id)
    return NextResponse.json({ 
      fetched: uids.length,
      emails: pendingReceipts
     });

  } finally {
    lock.release();
    await client.logout();
  }

  async function updateLastSynced(supabase: SupabaseClient, userId: string) {
      await supabase
          .from("email_sync_settings")
          .update({ last_synced_at: new Date().toISOString() })
          .eq("user_id", userId);
  }
}