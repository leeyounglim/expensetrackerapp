# 💸 Automated Expense Tracker

> A secure, automated expense tracking application that syncs directly with bank emails via IMAP to extract and log transaction data in real-time.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database_&_Auth-3ECF8E?logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

*(📸 Add a GIF or screenshot of your dashboard here)*

## 🚀 Overview

Tracking expenses manually is tedious. This application solves that by integrating directly with the user's email inbox (via secure IMAP) to automatically detect, parse, and log bank transaction receipts (e.g., DBS, UOB). 

Built with the **Next.js App Router**, this project emphasizes enterprise-grade security, utilizing **Supabase Row Level Security (RLS)** to protect user data and custom Edge Middleware to seamlessly handle authenticated routing.

## ✨ Key Features

* **🤖 Automated IMAP Parsing:** Securely connects to user inboxes using App Passwords to fetch and parse bank receipts using custom Regex, filtering out non-transactional emails.
* **🔒 Enterprise-Grade Security:** User API credentials are mathematically encrypted prior to database insertion. Data access is strictly controlled via Supabase Row Level Security (RLS).
* **⚡ Edge-Optimized Middleware:** Custom Next.js middleware handles chunked Supabase session cookies on Vercel's Edge Network to prevent routing freezes and ensure secure page guarding.
* **🔄 Real-Time UI Updates:** Next.js client-side cache busting and Supabase Realtime subscriptions ensure the UI always reflects the latest database state without manual refreshes.
* **🏦 Multi-bank support:** UOB, DBS/POSB, OCBC, Standard Chartered, HSBC, Citibank.
* **📊 Expense dashboard: ** Visualise spending over time with Chart.js line and pie charts.

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, CSS
* **Backend:** Next.js API Routes (Node.js runtime for IMAP operations)
* **Database & Auth:** Supabase (PostgreSQL, Supabase Auth)
* **Deployment:** Vercel

## 🔐 Security Architecture

Security is a primary focus of this application.
1. **No Real Passwords:** Users provide one-time "App Passwords," never their actual Google/Yahoo passwords.
2. **Encrypted Vault:** App Passwords are encrypted using a server-side `ENCRYPTION_KEY` before being stored in the database.
3. **Data Isolation:** Supabase RLS guarantees that `auth.uid() = user_id`, meaning users can physically only query their own receipts.
4. **Targeted Parsing:** The IMAP engine filters by specific bank sender addresses *at the server level*, ensuring personal emails are never downloaded or processed.

---

## 💻 Local Development Setup

Want to run this locally? Follow these steps.

### 1. Clone the repository
```bash
git clone [https://github.com/](https://github.com/)[YourUsername]/[YourRepoName].git
cd [YourRepoName]
