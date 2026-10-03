# 🌌 EduVerse AI — Futuristic 3D & Intelligent Learning Universe

> **"Your Learning Universe Starts Here."**  
> Complete Next-Generation Board Examination Preparation Platform for **Classes 10, 11 & 12** preparing for **CBSE, ICSE/ISC, Punjab School Education Board (PSEB), and State Boards**.

---

## 🚀 Key Features & Architectural Modules

### 1. 🪐 3D Learning Cosmos & Spatial Design System
- **Interactive 3D Learning Planet**: Three.js canvas featuring a floating educational sphere, orbital rings, and interactive subject satellites.
- **Dual View Modes**: Seamless toggle between the 3D Cosmos and the fast 2D matrix view for low-power devices.
- **WebGL Fallback & Reduced Motion**: Adaptive performance rendering with automatic WebGL context loss handling.

### 2. 🔬 Interactive 3D Subject Worlds (`/worlds`)
- **Mathematics (Spatial Geometry & Euler Characteristic)**: 3D Platonic Solids (Icosahedron, Dodecahedron, Octahedron) with real-time wireframe analysis and $V - E + F = 2$ formula verification.
- **Physics (Keplerian Planetary Orbits & Optics)**: Real-time planetary gravity and orbit simulations with adjustable velocity and eccentricity.
- **Chemistry (Tetrahedral Molecular Configurations)**: Interactive $CH_4$, $H_2O$, $CO_2$ molecular geometry with VSEPR $109.5^\circ$ bond angles and lone pairs.
- **Biology (DNA Double Helix Structure)**: 3D double helix model rendering major/minor grooves and complementary base pairing ($A=T, G \equiv C$).

### 3. 🧠 Adaptive AI Study Planner (`/planner`)
- **Real-Time Study Hours Adjustment**: Custom slider ($1-10\text{ hrs/day}$) dynamically recalculating chapter sessions and exam-day pacing.
- **Adaptive Remediation Engine**: Automatically queues targeted revisions based on mock exam diagnostic mistakes.
- **Structured Task Hierarchy**: Categorized into New Concepts, Practice Questions, Spaced Revision, PYQs, and Mock Exams.

### 4. 🤖 AI Personal Learning Companion & 3D Avatar (`/tutor`)
- **3D Animated Companion Avatar**: Reactive orb with mood states (`idle`, `thinking`, `explaining`, `celebrating`).
- **Web Speech API Audio Synthesis**: In-browser speech synthesis (`🔊 Read Out`) for auditory learners.
- **Pedagogical Solvers**: Concept Explanation, Step-by-Step Solver, Hint-First, Quiz Me, and Homework Helper.

### 5. 🏆 3D Trophy Showcase & Gamification (`/trophies`)
- **5-Tier Academic Leveling**: *Novice Explorer* → *Orbit Cadet* → *Quantum Scholar* → *Galaxy Master* → *Cosmic Board Topper*.
- **3D Collectible Artifacts**: Einstein Gold Medal, Newton Prism, Bohr Quantum Atom, Pythagoras Crystal, and Cosmic Flame.
- **Peer Discipline Leaderboard**: Privacy-first leaderboard rewarding study streaks and mock exam discipline.

### 6. ⚡ SuperMemo-2 (SM-2) Spaced Repetition Decks (`/notes`)
- **Interactive 3D Flip Cards**: Rapid active recall with keyboard and touch gesture support.
- **SM-2 Spaced Repetition Scheduling**: Real-time interval calculations (*Hard (1d)*, *Good (~3d)*, *Easy (6d+)*).
- **Formula Cheat Sheets & Mnemonics**: High-yield chapter summaries and memory tricks.

### 7. 🎯 Advanced Examination Engine & Practice Mode (`/exams`)
- **3 Exam Modes**: *Timed Board Exam Mode*, *Interactive Practice Mode* (instant step-by-step NCERT reasoning), and *Revision Mode*.
- **Question Palette & Live Autosave**: Real-time status indicators and persistent response autosaving.
- **Board Rubric Evaluation**: Automated AI evaluation for descriptive answers and numericals.

### 8. 📊 Academic Analytics & Topic Mastery Index (`/performance`)
- **Mastery Diagnostic Index**: Differentiates between *Demonstrated Mastery* (test scores) and *Estimated Mastery* (content coverage).
- **Pace Diagnostic**: Average seconds and minutes spent per question.
- **Date Range Filtration**: Last 7 Days, Last 30 Days, and All Time comparative analysis.

### 9. 📚 10-Year Verified PYQ Archive (`/papers`)
- Comprehensive filtering by Board, Class, Subject, Year (2016–2025), and Exam Type.
- Full in-browser simulated paper viewer with toggleable official marking schemes and PDF download.

### 10. 🛡️ Administrator Content & Feature Controls (`/admin`)
- Stage 2 Feature Flags & 3D graphic fidelity toggles.
- Gamification XP rules and multiplier management.
- Question paper verification and mock exam creation.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (Turbopack, App Router)
- **3D Graphics**: Three.js (`three`, `@types/three`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Vanilla Glassmorphism
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Database / Auth**: Supabase PostgreSQL (Full migrations in `supabase/migrations/`)
- **AI Engine**: Google Gemini API route + pedagogical offline engine

---

## 📦 Getting Started Locally

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
\`\`\`bash
cp .env.example .env.local
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
\`\`\`bash
npm run build
\`\`\`

---

## 🗄️ Database Migrations

- `supabase/migrations/001_initial_schema.sql` — Initial MVP schema (users, subjects, chapters, papers, exams, attempts, notes).
- `supabase/migrations/002_stage2_features.sql` — Stage 2 schema (study tasks, achievements, XP transactions, flashcard schedules, user settings).

---

## ⚖️ Academic Fair Use Notice
EduVerse AI is an independent academic preparation platform. All question papers, marks blueprints, and syllabus references are provided for fair educational practice and self-assessment.
