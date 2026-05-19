This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 🇸🇬 Singapore Expense Tracker

A personal finance dashboard that automatically tracks expenses from bank email receipts, providing visual insights into spending patterns.

## 🔧 Technical Stack
- **Frontend**: React 18, Chart.js, Tailwind CSS
- **Backend**: Next.js API routes, Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Email Processing**: IMAP protocol with node-imap, custom parsers for Singapore banks
- **Deployment**: Vercel + Supabase

## ✨ Key Features
- **Automated Expense Entry**: Connects to Gmail via IMAP, extracts transaction details from UOB/OCBC/DBS bank notifications
- **Interactive Dashboard**: Real-time charts showing monthly trends, category breakdown, and spending comparisons
- **Multi-User Support**: Secure authentication with Row Level Security ensures users only access their own data
- **Smart Categorization**: ML-inspired pattern matching automatically categorizes merchants (Grab → Transport, NTUC → Groceries)
- **Mobile Responsive**: Fully responsive design works on all devices

## 🏗️ Architecture Highlights
- Migrated from local JSON Server to Supabase PostgreSQL for cloud persistence
- Implemented Row Level Security policies for data isolation
- Built custom email parsers for Singapore-specific bank formats
- Scheduled email processing using Vercel Cron Jobs + Next.js API routes
- Real-time dashboard updates with Supabase subscriptions

## 📊 Impact
- Eliminated manual data entry entirely for recurring bank transactions
- Provides actionable insights into spending habits through visual analytics
- Serves as daily driver for personal finance management
