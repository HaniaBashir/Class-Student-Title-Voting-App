
````markdown
# 🎓 Farewell Voting App

A clean, minimal, and reusable farewell voting platform for classes.  
Students get one-time voting credentials, vote for classmates under custom titles, and admins manage everything from a simple dashboard.

---

## ✨ Features

- One-time voting per student
- Admin dashboard for managing titles and students
- Support for both **single-person** and **duo** titles
- CSV upload for students
- CSV export with generated emails and passwords
- Google Sheets + Apps Script workflow for emailing passwords
- Live results dashboard
- Modern UI built for software engineering students who *will* judge the design

---

## 🖼️ Screenshots

> Add your screenshots here once ready.

### Landing Page
```md
![Landing Page](./screenshots/landing-page.png)
````

### Voting Page

```md
![Voting Page](./screenshots/voting-page.png)
```

### Admin Dashboard

```md
![Admin Dashboard](./screenshots/admin-dashboard.png)
```

### Export CSV Page

```md
![Export CSV Page](./screenshots/export-page.png)
```

---

## 🚀 Setting this up for your own class

Don’t worry — this is made for software engineering students, so everything is simple, structured, and copy-paste friendly.

---

## 1. 📥 Clone the repository

Open terminal and run:

```bash
git clone https://github.com/HaniaBashir/Class-Student-Title-Voting-App.git
cd Class-Student-Title-Voting-App
```

---

## 2. 📦 Install dependencies

Make sure you have Node.js installed first.

Then run:

```bash
npm install
```

---

## 3. 🧠 Create your Supabase project

Go here:
👉 [https://supabase.com](https://supabase.com)

Steps:

1. Sign up / log in
2. Click **New Project**
3. Give it a name, for example `class-voting`
4. Set a database password and save it somewhere safe
5. Wait for the project to finish creating

---

## 4. 🗄️ Set up your database

Go to:

**Supabase Dashboard → SQL Editor**

### Run schema

Open your repo and go to:

```text
supabase/schema.sql
```

Copy everything from that file, paste it into Supabase SQL Editor, and click **Run**.

## 5. 🔑 Set environment variables

Create a file in your project root called:

```text
.env
```

Paste this inside:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_ADMIN_PASSWORD=your_admin_password_here
```

### 📍 Where to get these values

Go to:

**Supabase → Settings → API**

Copy:

* **Project URL** → `VITE_SUPABASE_URL`
* **anon public key** → `VITE_SUPABASE_ANON_KEY`

You can add your own screenshot here in the README if you want:

```md
![Supabase API Keys Location](./screenshots/supabase-api-keys.png)
```

---

## 6. ▶️ Run the app locally

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

## 7. 🌍 Deploy on Vercel

Go here:
👉 [https://vercel.com](https://vercel.com)

Steps:

1. Click **New Project**
2. Import your GitHub repo
3. Add the same environment variables from your `.env`
4. Click **Deploy**

Done 🎉

---

## ⚙️ Admin setup flow

Once deployed, go to:

```text
/admin
```

Enter your admin password.

---

## 🏷️ Step 1 — Add Titles

* Go to **Titles**
* Add your farewell titles
* Choose the type:

  * `single` → one person
  * `duo` → two people

---

## 👩‍🎓 Step 2 — Add Students

You have 2 options:

### Option A — Manual

* Enter roll number and name
* Click **Add student**

### Option B — CSV Upload (recommended)

Upload a CSV like this:

```csv
Roll Number,Student Name
22i-2506,Hania Bashir
22i-2629,Abdul Faheem
```

The CSV parser is designed to be flexible with column names.

---

## 📤 Step 3 — Export CSV

Go to:

**Export CSV**

This generates a downloadable CSV with:

* `roll_number`
* `student_name`
* `email`
* `password`
* `sent`

This is the file you’ll use in Google Sheets to email credentials to your class.

---

## 📧 Send passwords automatically using Google Sheets

### Step 1 — Open Google Sheets

👉 [https://sheets.google.com](https://sheets.google.com)

Import your exported CSV file.

### Step 2 — Open Apps Script

From the top menu:

**Extensions → Apps Script**

### Step 3 — Replace the default code with this

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

### Step 4 — Replace the voting link

Replace:

```text
PASTE_YOUR_WEBSITE_LINK_HERE
```

with your deployed Vercel URL, for example:

```text
https://YOUR_VERCEL_LINK.vercel.app
```

### Step 5 — Run it

1. Click **Run**
2. Approve permissions
3. Emails will send automatically
4. The `sent` column will update to `YES`

---

## 💡 Supabase Free Tier Note

This app uses Supabase.

At the time of writing:

* the Free Plan allows **2 active free projects**
* it is suitable for student and class projects
* users should still verify current pricing before use

Check the latest pricing here:
👉 [https://supabase.com/pricing](https://supabase.com/pricing)

---

## 🧱 Tech Stack

* **Frontend:** React + Vite
* **Styling:** Tailwind CSS
* **Backend / Database:** Supabase
* **Charts:** Recharts
* **Deployment:** Vercel

---

## 📂 Project Structure

```text
farewell-voting-app/
├─ supabase/
│  ├─ schema.sql
│  └─ seed.sql
├─ src/
│  ├─ components/
│  ├─ pages/
│  ├─ hooks/
│  ├─ lib/
│  ├─ data/
│  ├─ utils/
│  └─ types/
├─ .env.example
├─ package.json
└─ README.md
```

---

## 🧠 Notes

* Each student gets **one vote only**
* Passwords are **one-time use**
* Duplicate voting is blocked
* Duo titles are supported
* Admin can manage setup without editing code
* CSV export is designed to work smoothly with Google Sheets

---

## 🫶 Made for students, by students

If you're using this for your class — good luck and have fun with it.
And yes, people *will* take voting very seriously 😭
``
