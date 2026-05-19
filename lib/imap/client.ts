// lib/imap/client.ts
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

export interface EmailAccount {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class ImapClient {
  private client: ImapFlow;
  
  constructor(account: EmailAccount) {
    this.client = new ImapFlow({
      host: account.host,
      port: account.port,
      secure: account.secure,
      auth: account.auth,
      logger: false, // Set to true for debugging
      tls: {
        rejectUnauthorized: false // For self-signed certs
      }
    });
  }

  async connect() {
    await this.client.connect();
    console.log('Connected to IMAP server');
  }

  async disconnect() {
    await this.client.logout();
    console.log('Disconnected from IMAP server');
  }

  async getClient() {
    return this.client;
  }
}