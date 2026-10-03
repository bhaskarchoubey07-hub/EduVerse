-- =========================================================
-- EDUVERSE AI DATABASE MIGRATION - SCHEMA v1.0
-- Complete production schema for Indian Board Exam Prep
-- Includes Profiles, Boards, Syllabus, PYQ Papers, Exams,
-- Test Attempts, AI Chats, Revision Notes & Analytics
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & USER ROLES
CREATE TYPE user_role AS ENUM ('student', 'admin', 'educator');
CREATE TYPE class_level AS ENUM ('10', '11', '12');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'student',
  board_id TEXT NOT NULL DEFAULT 'cbse',
  class_level class_level DEFAULT '10',
  stream TEXT,
  academic_session TEXT DEFAULT '2026-2027',
  selected_subject_ids TEXT[] DEFAULT '{}',
  preferred_language TEXT DEFAULT 'english',
  target_exam_date DATE DEFAULT '2027-02-15',
  daily_goal_minutes INT DEFAULT 45,
  streak_days INT DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BOARDS & SYLLABUS
CREATE TABLE IF NOT EXISTS public.boards (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  description TEXT,
  logo_text TEXT,
  available_classes INT[] DEFAULT '{10, 11, 12}',
  state TEXT,
  active_sessions TEXT[] DEFAULT '{"2026-2027", "2025-2026"}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  board_id TEXT REFERENCES public.boards(id) ON DELETE CASCADE,
  class_level INT NOT NULL,
  icon_name TEXT DEFAULT 'BookOpen',
  color TEXT DEFAULT 'violet',
  chapter_count INT DEFAULT 0,
  total_marks INT DEFAULT 100,
  theory_marks INT DEFAULT 80,
  practical_marks INT DEFAULT 20,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chapters (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  marks_weightage INT DEFAULT 0,
  estimated_hours INT DEFAULT 4,
  key_formulas TEXT[] DEFAULT '{}',
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  importance TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PREVIOUS YEAR QUESTION PAPERS (PYQ)
CREATE TYPE paper_type AS ENUM ('official_board', 'sample_paper', 'compartment', 'pre_board');

CREATE TABLE IF NOT EXISTS public.question_papers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  board_id TEXT REFERENCES public.boards(id) ON DELETE CASCADE,
  class_level INT NOT NULL,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  year INT NOT NULL,
  paper_type paper_type DEFAULT 'official_board',
  set_number TEXT DEFAULT 'Set 1',
  total_marks INT DEFAULT 80,
  duration_minutes INT DEFAULT 180,
  is_verified_official BOOLEAN DEFAULT TRUE,
  verified_by TEXT,
  pdf_url TEXT,
  download_count INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. QUESTION BANK & MOCK EXAMS
CREATE TYPE question_type AS ENUM ('mcq', 'numerical', 'short_answer', 'long_answer', 'assertion_reason');

CREATE TABLE IF NOT EXISTS public.question_bank (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE SET NULL,
  paper_id TEXT REFERENCES public.question_papers(id) ON DELETE SET NULL,
  type question_type DEFAULT 'mcq',
  text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  marks INT DEFAULT 1,
  negative_marks NUMERIC(3,2) DEFAULT 0,
  explanation TEXT,
  difficulty TEXT DEFAULT 'medium',
  hint TEXT,
  step_by_step_solution TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mock_exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  board_id TEXT REFERENCES public.boards(id) ON DELETE CASCADE,
  class_level INT NOT NULL,
  chapter_ids TEXT[] DEFAULT '{}',
  duration_minutes INT DEFAULT 60,
  total_marks INT DEFAULT 40,
  is_full_length BOOLEAN DEFAULT FALSE,
  question_count INT DEFAULT 20,
  description TEXT,
  instructions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TEST ATTEMPTS & RESPONSES
CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  exam_id TEXT REFERENCES public.mock_exams(id) ON DELETE CASCADE,
  exam_title TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  score NUMERIC(5,2) DEFAULT 0,
  total_marks INT NOT NULL,
  percentage NUMERIC(5,2) DEFAULT 0,
  time_spent_seconds INT DEFAULT 0,
  accuracy_rate NUMERIC(5,2) DEFAULT 0,
  status TEXT DEFAULT 'in_progress',
  responses JSONB DEFAULT '{}'::jsonb,
  topic_breakdown JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AI CONVERSATIONS & SAVED NOTES
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id TEXT,
  chapter_id TEXT,
  title TEXT NOT NULL,
  mode TEXT DEFAULT 'explain',
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.saved_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  content TEXT NOT NULL,
  note_type TEXT DEFAULT 'ai_generated',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'paper', 'chapter', 'question'
  item_id TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.study_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  duration_minutes INT DEFAULT 15,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_activity ENABLE ROW LEVEL SECURITY;

-- Students can read/write their own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can view own attempts" ON public.exam_attempts FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Students can view own AI chats" ON public.ai_conversations FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Students can view own notes" ON public.saved_notes FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Students can view own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Students can view own activity" ON public.study_activity FOR ALL USING (auth.uid() = student_id);

-- Public educational content is readable by everyone
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view boards" ON public.boards FOR SELECT USING (true);
CREATE POLICY "Public can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public can view chapters" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Public can view topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Public can view papers" ON public.question_papers FOR SELECT USING (true);
CREATE POLICY "Public can view question bank" ON public.question_bank FOR SELECT USING (true);
CREATE POLICY "Public can view mock exams" ON public.mock_exams FOR SELECT USING (true);

-- INDEXES for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_subjects_board_class ON public.subjects(board_id, class_level);
CREATE INDEX IF NOT EXISTS idx_chapters_subject ON public.chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_papers_filter ON public.question_papers(board_id, class_level, subject_id, year);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON public.exam_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_chats_student ON public.ai_conversations(student_id);
