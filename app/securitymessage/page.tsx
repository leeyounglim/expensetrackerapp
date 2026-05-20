import Link from 'next/link';

export default function SecurityPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6 text-[#f1356d]">
        A quick note on security
      </h1>
      
      <p className="mb-4 text-gray-700">
        Before you set up your account, I want to address some concerns regarding <strong>Security.</strong>
      </p>
      
      <p className="mb-8 text-gray-700">
        Because this app works by syncing with your email to automatically track your bank receipts, it requires access to your inbox. Your digital security is incredibly important, so I want to be 100% transparent about how this app works, what I can see, and the enterprise-grade tools protecting your data.
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. This app does NOT want your real email password.</h2>
          <p className="text-gray-700">
            You will never type your actual email password into my app. Instead, you will generate a one-time "App Password" directly through Google/Yahoo. It gives the app permission to sync, but you can revoke it instantly at any time from your email account without changing your real password.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. The app does not read your personal emails.</h2>
          <p className="text-gray-700">
            The app's code is strictly designed to only look for emails from specific bank sender addresses (like UOB or DBS). It filters out everything else at the server level. It essentially scans for the dollar amount and the date, logs the transaction, and ignores the rest of your inbox.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Your data is locked securely.</h2>
          <p className="text-gray-700">
            The app runs on enterprise-grade platforms used by major tech companies. <strong>Vercel</strong> encrypts all data travelling between your phone and the app, and <strong>Supabase</strong> (our database) uses "Row Level Security." This guarantees that only you can view your own expenses.
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link 
          href="/emailsetting" 
          className="inline-block bg-[#f1356d] text-white px-6 py-2 rounded hover:opacity-90"
        >
          Return to Setup
        </Link>
      </div>
    </div>
  );
}