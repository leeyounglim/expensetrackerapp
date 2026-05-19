import { MouseEventHandler, useState } from "react";

interface SetupProps {
    handleConnect: (email: string, pass: string) => Promise<void>;
}

const Setup = ({handleConnect}:SetupProps) => {
    const [setupStep, setSetupStep] = useState(0); // 0 = landing, 1 = enter email, 2 = enter app password
    const [setupEmail, setSetupEmail] = useState("");
    const [setupPass, setSetupPass] = useState("");
    const [setupConnecting, setSetupConnecting] = useState(false);
    
    return ( <div className="es-ob-wrap">
    
            {/* ── Landing ── */}
            {setupStep === 0 && (
            <>
                <div className="es-eyebrow">Email Sync · Setup</div>
                <h1 className="es-title">Auto-import bank transactions</h1>
                <p className="es-desc">
                Connect your Gmail to automatically detect and import expenses from
                bank notification emails. No manual entry needed.
                </p>
    
                <div className="es-step-list">
                <div className="es-step">
                    <div className="es-step-num">01</div>
                    <div>
                    <strong className="es-step-title">Enable IMAP in Gmail</strong>
                    <span className="es-step-desc">
                        Settings → See all settings → Forwarding and POP/IMAP → Enable IMAP
                    </span>
                    </div>
                </div>
                <div className="es-step">
                    <div className="es-step-num">02</div>
                    <div>
                    <strong className="es-step-title">Generate an App Password</strong>
                    <span className="es-step-desc">
                        Google Account → Security → 2-Step Verification must be on →{" "}
                        <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noreferrer"
                        className="es-link"
                        >
                        App Passwords
                        </a>{" "}
                        → create one
                    </span>
                    </div>
                </div>
                <div className="es-step">
                    <div className="es-step-num">03</div>
                    <div>
                    <strong className="es-step-title">Enter credentials here</strong>
                    <span className="es-step-desc">
                        Your password is stored locally and never sent to any server.
                    </span>
                    </div>
                </div>
                </div>
    
                <button className="es-btn-start" onClick={() => setSetupStep(1)}>
                Get started →
                </button>
            </>
            )}
    
            {/* ── Step 1: Email ── */}
            {setupStep === 1 && (
            <>
                <div className="es-progress">
                <div className="es-prog-dot done" />
                <div className="es-prog-dot" />
                </div>
                <div className="es-eyebrow">Step 1 of 2</div>
                <h1 className="es-title-sm">Your Gmail address</h1>
                <div className="es-field-label">Email</div>
                <input
                className="es-input"
                type="email"
                placeholder="you@gmail.com"
                value={setupEmail}
                onChange={(e) => setSetupEmail(e.target.value)}
                />
                <div className="es-row">
                <button className="es-btn-back" onClick={() => setSetupStep(0)}>← Back</button>
                <button
                    className="es-btn-connect"
                    disabled={!setupEmail.includes("@")}
                    onClick={() => setSetupStep(2)}
                >
                    Next →
                </button>
                </div>
            </>
            )}
    
            {/* ── Step 2: App password ── */}
            {setupStep === 2 && (
            <>
                <div className="es-progress">
                <div className="es-prog-dot done" />
                <div className="es-prog-dot done" />
                </div>
                <div className="es-eyebrow">Step 2 of 2</div>
                <h1 className="es-title-sm">App Password</h1>
                <div className="es-field-label">16-character app password</div>
                <input
                className="es-input"
                type="password"
                placeholder="xxxx xxxx xxxx xxxx"
                value={setupPass}
                onChange={(e) => setSetupPass(e.target.value)}
                />
                <p className="es-hint">
                Generate one at{" "}
                <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noreferrer"
                >
                    myaccount.google.com/apppasswords
                </a>
                . Your regular Gmail password won&apos;t work here.
                </p>
                <div className="es-row">
                <button className="es-btn-back" onClick={() => setSetupStep(1)}>← Back</button>
                <button
                    className="es-btn-connect"
                    disabled={setupPass.replace(/\s/g, "").length < 16 || setupConnecting}
                    onClick={()=>handleConnect(setupEmail,setupPass)}
                >
                    {setupConnecting ? (
                    <><span className="es-spin">↻</span> Connecting…</>
                    ) : (
                    "Connect →"
                    )}
                </button>
                </div>
            </>
            )}
    
        </div> );
}
 
export default Setup;