<h1 align="center">🎓 Farewell Voting App 🎓</h1>

<p align="center">
  <b>farewell nahi ho rahi toh kia?</b><br>
  You can always have a title day in your class.<br>
  Here is your step by step guide for it.
</p>

<p align="center">
  A clean, minimal, and reusable farewell voting platform for classes.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue">
  <img alt="Supabase" src="https://img.shields.io/badge/Backend-Supabase-green">
  <img alt="Deploy" src="https://img.shields.io/badge/Deploy-Vercel-black">
</p>

---

## 🚀 Setting this up for your own class

Don’t worry — this is made for software engineering students, so everything is simple, structured, and copy-paste friendly.

---

## 📥 Clone the repository

Open your terminal and run:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
````

---

## 📦 Install dependencies

Make sure Node.js is installed.

```bash
npm install
```

---

## 🧠 Create your Supabase project

Go to:
[https://supabase.com](https://supabase.com)

### Steps

1. Sign up / log in
2. Click **New Project**
3. Give it a name (e.g. `class-voting`)
4. Set a database password and save it
5. Wait for setup to complete

---

## 🗄️ Set up your database

Go to:

Supabase Dashboard → SQL Editor

### Step 1 — Run schema

Open:

```
supabase/schema.sql
```

Copy everything → paste in SQL Editor → click **Run**

---

### Step 2 — Run seed (optional)

Open:

```
supabase/seed.sql
```

Copy → paste → **Run**

---

## 🔑 Set environment variables

Create a file in your project root:

```
.env
```

Paste:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_ADMIN_PASSWORD=your_admin_password_here
```

---

### 📍 Where to get these values

Go to:

Supabase → Settings → API

Copy:

* Project URL → `VITE_SUPABASE_URL`
* anon public key → `VITE_SUPABASE_ANON_KEY`
* anon public key → `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

---

## ▶️ Run the app locally

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 🌍 Deploy on Vercel

Go to:
[https://vercel.com](https://vercel.com)

### Steps

1. Click **New Project**
2. Import your GitHub repo
3. Add same `.env` variables
4. Click **Deploy**

Done 🎉

---

## ⚙️ Admin setup flow

Go to:

```
/admin
```

Enter your admin password.

---

## 🏷️ Step 1 — Add Titles

* Go to **Titles**
* Add farewell titles
* Choose:

  * `single` → one person
  * `duo` → two people

---

## 👩‍🎓 Step 2 — Add Students

### Option A — Manual

* Enter roll number + name
* Click **Add student**

---

### Option B — CSV Upload (recommended)

```csv
Roll Number,Student Name
22i-2506,Hania Bashir
22i-2629,Abdul Faheem
```

---

## 📤 Step 3 — Export CSV

Go to:

Export CSV

This file contains:

* roll_number
* student_name
* email
* password
* sent

---

## 📧 Send passwords using Google Sheets

### Step 1 — Open Google Sheets

[https://sheets.google.com](https://sheets.google.com)

Import your CSV

---

### Step 2 — Open Apps Script

Extensions → Apps Script

---

### Step 3 — Paste this code

```javascript
function sendVotingEmails() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const subject = "Your Farewell Voting Access";

  for (let i = 1; i < data.length; i++) {
    const rollNumber = data[i][0];
    const studentName = data[i][1];
    const email = data[i][2];
    const password = data[i][3];
    const sentStatus = data[i][4];

    if (!email || !password) continue;
    if (sentStatus === "YES") continue;

    const body = `Hi ${studentName},

You have been given access to the farewell voting website.

Your details are:

Roll Number: ${rollNumber}
Password: ${password}

Voting Link:
PASTE_YOUR_WEBSITE_LINK_HERE

Important:
- You can vote only once
- Do not share your password
- No self voting allowed

Good luck ✨`;

    GmailApp.sendEmail(email, subject, body);
    sheet.getRange(i + 1, 5).setValue("YES");
  }
}
```

---

### Step 4 — Add your link

Replace:

```
PASTE_YOUR_WEBSITE_LINK_HERE
```

with:

```
https://YOUR_VERCEL_LINK.vercel.app
```

---

### Step 5 — Run

* Click **Run**
* Allow permissions
* Emails will send automatically

---

## ✨ Features

* One-time voting per student
* Admin dashboard
* Single + duo titles
* CSV upload & export
* Auto email system via Google Sheets
* Live results dashboard
* Clean modern UI

---

## 🖼️ Screenshots

Add your images here:

```md
![Landing Page](./screenshots/landing-page.png)
![Voting Page](./screenshots/voting-page.png)
![Admin Dashboard](./screenshots/admin-dashboard.png)
```

---

## 🧱 Tech Stack

* Frontend: React + Vite
* Styling: Tailwind CSS
* Backend: Supabase
* Charts: Recharts
* Deployment: Vercel

---

## 📂 Project Structure

```text
farewell-voting-app/
├─ supabase/
│  ├─ schema.sql
│  └─ seed.sql
├─ src/
├─ .env
├─ package.json
└─ README.md
```

---

## 🧠 Notes

* Each student gets one vote
* Passwords are one-time use
* Duplicate voting is blocked
* Admin setup is simple
* Works smoothly with Google Sheets

---

## 🫶 Made for students, by students

If you're using this for your class — good luck.

And yes, people *will* take voting very seriously 😭

```
