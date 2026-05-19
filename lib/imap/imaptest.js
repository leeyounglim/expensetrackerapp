const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');


const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
        user: 'leeyoung.lim@gmail.com',
        pass: 'epku bnoq uuns spnl'
    }
});

async function main() {
    // Connect
    await client.connect();
    console.log('Connected');
    const data = []
    const lastRunDate = new Date();
    lastRunDate.setDate(lastRunDate.getDate()-10);

    // Select INBOX
    let lock = await client.getMailboxLock('INBOX');
    try {
        console.log(`INBOX has ${client.mailbox.exists} messages`);

        if (client.mailbox.exists > 0) {
            // Fetch latest 10 messages (or all if less than 10)
            const uids = await client.search({ since: lastRunDate, from: 'unialerts@uobgroup.com'});
            if (uids.length === 0) return;
            

            for await (let msg of client.fetch(uids, {
                envelope: true,
                flags: true,
                internalDate:true,
                source:true
            })) {
                const parsed = await simpleParser(msg.source);
                const seen = msg.flags.has('\\Seen') ? '' : '[UNREAD] ';
                console.log(`${seen}${msg.uid}: ${msg.envelope.subject}`);
                console.log('Text body:', parsed.text);
                console.log('HTML body:', parsed.html);
            }
        }
    } finally {
        lock.release();
    }
    // Logout
    await client.logout();
    console.log('Disconnected'); 
}

main().catch(console.error);