# DentaGuide 🦷🤖

**Daily dental health monitoring, powered by agentic AI.**

---

## Why we built this

Dental disease is almost entirely preventable, but only if you catch it early. Most people don't find out their habits are putting them at risk until they're already in pain and facing a bill they weren't expecting.

This hits hardest for people without dental insurance. No coverage means no routine cleanings, no early warnings, and small problems that quietly become expensive ones.

DentaGuide is that tool. Under 60 seconds a day, it tracks your habits, symptoms, and weekly photos to catch risk patterns before they develop into something serious. 

---

## Screenshots

### Daily check-in
<img src="photos/dailycheckin.png" width="300">

### Check-in result — AI agents
<img src="photos/results.png" width="300">

### Dashboard
<img src="photos/dashboard.png" width="300">

---

## How it works

Every daily check-in fires three AI agents simultaneously:

- **Habit Agent** — scores brushing, flossing, mouthwash, and sugar intake. Tracks streaks over time.
- **Risk Agent** — cross-references today's symptoms with 30 days of history and the user's specific tracked conditions. Flags patterns associated with early cavities, gingivitis, or enamel erosion.
- **Coach Agent** — generates one specific, actionable tip based on what the user is actually tracking. Personalised to their conditions, not a generic reminder to floss.

Users can also upload a weekly photo of their teeth. Gemini AI compares it to last week's and notes any visible changes such as gumline redness, discolouration, buildup as a screening tool, not a diagnosis.

---

## Running locally

### What you need

- Node.js 18+
- Python 3.11+
- A Supabase project
- An Gemini API key

---

## 1. Clone the repo

```bash
git clone https://github.com/your-username/dentaguide.git
cd dentaguide
```

---

## 2. Supabase setup

### Create the tables

In your Supabase project, go to **SQL Editor** and run the following:

```sql
-- Profiles table
create table if not exists profiles (
  user_id            uuid primary key references auth.users(id) on delete cascade,
  age                int,
  brushing_frequency text,
  flossing_frequency text,
  last_dentist_visit text,
  previous_treatments text,
  conditions         jsonb default '[]',
  ongoing_issues     text,
  medications        text,
  allergies          text,
  medical_procedures text,
  dental_habits      text,
  onboarding_complete boolean default false,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can manage their own profile"
  on profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Check-ins table
create table if not exists check_ins (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade,
  brushed          boolean default false,
  flossed          boolean default false,
  mouthwash        boolean default false,
  sugar_intake     text,
  symptoms         text[],
  photo_url        text,
  habit_score      int,
  streak           int,
  risk_severity    text,
  risk_flags       text[],
  risk_explanation text,
  coach_tip        text,
  dental_score     int,
  created_at       timestamptz default now()
);

alter table check_ins enable row level security;

create policy "Users can manage their own check-ins"
  on check_ins for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Risk flags table
create table if not exists risk_flags (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  severity    text,
  flags       text[],
  explanation text,
  resolved    boolean default false,
  created_at  timestamptz default now()
);

alter table risk_flags enable row level security;

create policy "Users can manage their own risk flags"
  on risk_flags for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### Create the photos storage bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it `photos`
4. Toggle **Public bucket** ON
5. Click **Create bucket**

### Disable email confirmation (for local dev)

1. Go to **Authentication → Providers → Email**
2. Turn off **Confirm email**
3. Save

### Get your API keys

From your Supabase project dashboard:
- **Project URL** → Settings → API → `Project URL`
- **Service role key** → Settings → API → `service_role` (secret key, not the anon key)

---

## 3. Backend setup

```bash
cd backend
```

### Create a virtual environment

```bash
python3.11 -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows
```

### Install dependencies

```bash
pip install -r requirements.txt
pip install httpx               # if not already in requirements.txt
```

### Create the `.env` file

Create `backend/.env` with the following:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
JWT_SECRET=any-random-string-you-choose
```

> ⚠️ Never commit this file. It's already in `.gitignore`.

### Start the backend

```bash
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Verify it's working: [http://localhost:8000](http://localhost:8000) should return `{"status": "ok"}`.

---

## 4. Frontend setup

Open a new terminal tab:

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Create the `.env.local` file

Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8000
```

### Start the frontend

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 5. First run

1. Click **Get started free** and create an account
2. Complete the 3-step onboarding (dental history, conditions, health background)
3. Go to **Check-in** and log your first daily check-in
4. Optionally upload a photo of your teeth for Gemini visual analysis
5. View your results, dashboard, and trends

---

## Project structure

```
dentaguide/
├── frontend/
│   ├── src/
│   │   ├── api/          # API call functions (auth, checkins, profile)
│   │   ├── components/   # Shared UI components (Navbar, HabitRow, Icons)
│   │   ├── context/      # AuthContext (JWT session management)
│   │   ├── pages/        # All page components
│   │   └── index.css     # Global design system (CSS variables)
│   ├── .env.local        # VITE_API_URL (create this)
│   └── package.json
│
└── backend/
    ├── agents/
    │   ├── habit_agent.py    # Scores brushing, flossing, sugar — calculates streak
    │   ├── risk_agent.py     # Gemini AI risk pattern detection
    │   └── coach_agent.py    # Gemini AI personalised tip generation
    ├── routers/
    │   ├── auth.py           # Register, login, logout, update user
    │   ├── profile.py        # Onboarding steps 1/2/3, profile read/update
    │   └── checkins.py       # Today, history, trends endpoints
    ├── photo_agent.py        # Gemini vision — dental photo analysis
    ├── orchestrator.py       # Runs all 3 agents in parallel (asyncio.gather)
    ├── main.py               # FastAPI app, /api/checkin route
    ├── db.py                 # Supabase client
    ├── models.py             # Pydantic request/response models
    ├── config.py             # Loads env vars
    ├── .env                  # Your secrets (create this, never commit)
    └── requirements.txt
```

---

## Team
- **Tharjiha Suthekara** — dashboard format, daily check-in flow, photo history analysis, bugfixes, account setting
- **Jennifer Huang** — dashboard information connection, authentication, profile onboarding, trends page functionality, API integration
