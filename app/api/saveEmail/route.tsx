import { encrypt } from "@/lib/imap/encryption";
import { createClient } from "@/lib/supabase/server";


export async function POST(req: Request) {
    console.log('posting')
    const { setupEmail, setupPass } = await req.json();
    console.log('email:', setupEmail)

    const encryptedPassword = encrypt(setupPass);
    const supabase =  await createClient();
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();  
    
    const userId = user?.id;
    console.log('userId:', userId)

    const { error } = await supabase
        .from('email_sync_settings')
        .insert([{ user_id: userId, email: setupEmail, app_password: encryptedPassword }])
    
    if (error) {
        console.error('insert error:', error)
        return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true }, { status: 200 })
}