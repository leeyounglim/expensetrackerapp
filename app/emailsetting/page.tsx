'use client';
import { useAuth } from '@/app/providers'; 
import { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import useFetch from '@/lib/useFetch';
import Setup from '@/components/setup'
 
const banks = [
  { id: "uob", name: "UOB", color: "#0033A0", abbr: "UOB", sender: "unialerts@uobgroup.com" },
  { id: "dbs", name: "DBS / POSB", color: "#E60028", abbr: "DBS", sender: "dbseadvice@dbs.com" },
  { id: "ocbc", name: "OCBC", color: "#EE3524", abbr: "OCBC", sender: "Notifications@ocbc.com" },
  { id: "sc", name: "Standard Chartered", color: "#00A9E0", abbr: "SC", sender: "notifications@sc.com" },
  { id: "hsbc", name: "HSBC", color: "#DB0011", abbr: "HSBC", sender: "hsbc.notifications@messaging.hsbc.com.sg" },
  { id: "citi", name: "Citibank", color: "#003087", abbr: "CITI", sender: "citi.securemail@citi.com" },
];

interface PendingReceipt {
          uid: number;
          bank: string;
          date: Date;
          amount: string;
          subject: string;
      }

const manageEmail = () => {
    const {user, isPending} = useAuth();
    
    const [enabledBanks, setEnabledBanks] = useState<Record<string,boolean>>({  });
    const [savedBanks, setSavedBanks] = useState<Record<string,boolean>>({});
    const [fetchingBank, setFetchingBank] = useState<string|null>(null);
    const [activeTab, setActiveTab] = useState("config");
    const [isSetup, setIsSetup] = useState<boolean| null>(null);
    const [setupConnecting, setSetupConnecting] = useState(false);
    const [email, setEmail] = useState("");
    const [fetchingAll, setFetchingAll] = useState(false);
    const [saving, setSaving] = useState(false);
    const [pendingReceipts, setPendingReceipts] = useState<PendingReceipt[]>([]);
    const [isConnected, setIsConnected] = useState(true);


    const { data: settingsData, isPending: settingsPending } = useFetch('email_sync_settings', {
        select: 'email',
        limit: 1
        });

    useEffect(() => {
    if (settingsPending) return;
    setIsSetup(settingsData !== null && settingsData.length > 0);
    }, [settingsData, settingsPending]);

    const supabase = createClient();
    const {data: bankData} = useFetch('email_sync_banks',{
        select: 'bank_id, enabled'
        });
    useEffect(() => {
        if (!bankData) return;
        const mapped = Object.fromEntries(bankData.map(row => [row.bank_id, row.enabled]));
        setEnabledBanks(mapped);
        setSavedBanks(mapped);
    },[bankData])

    const hasChanges = banks.some(bank => 
        !!enabledBanks[bank.id] !== !!savedBanks[bank.id]
    );

    async function handleSave() {
        setSaving(true);
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        const rows = Object.entries(enabledBanks).map(([bank_id, enabled]) => ({
            user_id: userId,
            bank_id,
            enabled
        }));

        const { error } = await supabase
            .from('email_sync_banks')
            .upsert(rows, { onConflict: 'user_id, bank_id' });

        if (error) {
            console.error(error)}
        else{
            setSavedBanks(enabledBanks)
        };
        setSaving(false);
    }
    async function handleFetchBank(id:string) {
        setFetchingBank(id);
        await new Promise((r) => setTimeout(r, 1600));
        setFetchingBank(null);
    }

    function toggleBank(id:string) {
        setEnabledBanks((prev) => ({ ...prev, [id]: !prev[id] }));
        console.log(enabledBanks)
    }
    async function handleConnect(setupEmail:string,setupPass:string) {
        
        setSetupConnecting(true);
        try{
        await fetch("/api/saveEmail",{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({setupEmail,setupPass})
        })
        }catch(err){
            console.error(err)
            
        }
        setSetupConnecting(false);
        setIsSetup(true);
    }

    async function handleDelete(){
const confirmDisconnect = window.confirm(
            "Are you sure you want to disconnect your email? You will need to set it up again to sync receipts."
        );
        
        if (!confirmDisconnect) return;

        try {
            // 1. Wipe the credentials from the database
            if (!user) return null;
            const { error } = await supabase
                .from('email_sync_settings')
                .delete()
                .eq('user_id', user.id); 

            if (error) throw error;

            // 2. Reset the UI State immediately
            setIsSetup(false);
            setIsConnected(false); 
            
            // Optional: clear out the old data so it's fresh if they reconnect
            setEnabledBanks({});
            setPendingReceipts([]); 

        } catch (err) {
            console.error("Failed to disconnect email:", err);
            alert("Failed to disconnect. Please try again.");
        }
    }
    async function handleFetchAll() {
        setFetchingAll(true);
        console.log('api run')
        try {
            const res = await fetch("/api/syncemail", { method: "POST" });
            console.log("status:", res.status);
            
            const data = await res.json();
            console.log("fetch data:", data);

            if (data.emails && data.emails.length > 0) {
                setPendingReceipts(data.emails);
            } else if (data.fetched === 0) {
                // Optional: Alert the user that there are no new emails right now
                console.log("No new bank emails to review.");
            }
            
            // No router.push here! Just running the API.
            
        } catch (err) {
            console.error("fetch error:", err);
            setIsConnected(false);
        } finally {
            // This ensures the loading state is turned off 
            // whether the fetch succeeds OR fails.
            setFetchingAll(false);
        }
    }

    if (isPending) return 
        (<div>Loading...</div>)
    if (!user) return 
        (<div>no user</div>)
    if (isSetup === null || settingsPending) return(
        (<div>Loading...</div>)
    )


    if (!isSetup) {
        return (
            <Setup handleConnect = {handleConnect} />
        );
    }
        

    if (isSetup) return ( 
        <div className = "page-wrap">
            <div className="header">
                <h1>Email Sync</h1>
                <div className={`conn-badge ${isConnected ? "ok" : "err"}`}>
                    <div className={`dot ${isConnected ? "ok" : "err"}`} />
                    {isConnected ? "Connected" : "Disconnected"}
                </div>
            </div>
            {/* Tabs */}
            <div className="tabs">
            {["config", "log"].map((t) => (
                <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
                {t === "config" ? "Configuration" : "Sync Log"}
                </button>
            ))}
            </div>
            {activeTab === 'config' &&(
                <>
                <div className="section">
                <div className="section-label">Gmail Account</div>
                <div className="card">
                    <div className="email-row">
                    <div className="email-icon">✉</div>
                    <div className="email-text">
                        <strong>{user.email}</strong>
                        <span>IMAP </span>
                    </div>
                    <button className="btn-ghost" style={{ color: '#E60028' }}
                    onClick = {()=> handleDelete()}>Disconnect</button>
                    </div>
                </div>
                </div>

              {/* Banks */}
                <div className="section">
                <div className="section-label">Banks to monitor</div>
                <div className="bank-grid">
                    {banks.map((bank) => {
                    const on = !!enabledBanks[bank.id];
                    const fetching = fetchingBank === bank.id;
                    return (
                        <div key={bank.id} className="bank-row">
                        <div
                            className="bank-chip"
                            style={{ background: bank.color + "22", color: bank.color, border: `1px solid ${bank.color}44` }}
                        >
                            {bank.abbr}
                        </div>
                        <div className="bank-info">
                            <strong>{bank.name}</strong>
                            <span>{bank.sender}</span>
                        </div>
                        <div className="bank-actions">
                            <button
                            className={`toggle ${on ? "on" : "off"}`}
                            onClick={() => {
                                return toggleBank(bank.id)}}
                            >
                            <div className="toggle-thumb" />
                            </button>
                        </div>
                        </div>
                    );
                    })}
                    <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    >
                    {saving ? (
                        <><span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>↻</span> Saving…</>
                    ) : (
                        <>✓ Save changes</>
                    )}
                    </button>
                </div>
                </div>
                <button className="fetch-all-btn" onClick={handleFetchAll} disabled={fetchingAll}>
                {fetchingAll ? (
                    <><span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>↻</span> Fetching…</>
                ) : (
                    <>↓ Fetch all banks now</>
                )}
                </button>
                </>
            )}            
        </div>
     );
}
 
export default manageEmail;