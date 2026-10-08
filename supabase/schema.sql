-- ==============================================================================
-- EDUVERSE AI — COMPLETE DATABASE ARCHITECTURE & ROW LEVEL SECURITY (RLS)
-- Free-First Production Stack for Supabase PostgreSQL
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. PROFILES TABLE (Linked directly to auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  class_level INT DEFAULT 10 CHECK (class_level IN (10, 11, 12)),
  board TEXT DEFAULT 'cbse',
  stream TEXT DEFAULT 'general_10th',
  preferred_language TEXT DEFAULT 'english',
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin', 'educator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. STUDENT PROGRESS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  topic TEXT,
  completion_percentage INT DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  lessons_completed INT DEFAULT 0,
  questions_attempted INT DEFAULT 0,
  questions_correct INT DEFAULT 0,
  study_time_minutes INT DEFAULT 0,
  last_studied_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. SAVED ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('question', 'note', 'explanation', '3d_concept', 'flashcard', 'pyq')),
  content_id TEXT NOT NULL,
  title TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. AI CONVERSATIONS & MESSAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT,
  chapter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. MOCK EXAM RESULTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mock_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id TEXT NOT NULL,
  score NUMERIC NOT NULL,
  total_marks NUMERIC NOT NULL,
  percentage NUMERIC NOT NULL,
  correct_answers INT DEFAULT 0,
  incorrect_answers INT DEFAULT 0,
  unanswered INT DEFAULT 0,
  time_taken INT DEFAULT 0, -- seconds
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. STUDY SESSIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  topic TEXT,
  duration_minutes INT DEFAULT 0,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('lesson', '3d_lab', 'question_paper', 'mock_exam', 'ai_tutor', 'revision', 'flashcards')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 8. GAMIFICATION & STREAKS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_gamification (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_xp INT DEFAULT 150,
  current_level INT DEFAULT 1,
  streak_days INT DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  unlocked_trophies TEXT[] DEFAULT ARRAY[]::TEXT[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. AI USAGE RATE LIMITING TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_usage_tracking (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  message_count INT DEFAULT 1,
  PRIMARY KEY (user_id, usage_date)
);

-- ==============================================================================
-- 10. INDEXES FOR HIGH-PERFORMANCE FREE-TIER QUERIES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_progress_user_subject ON public.student_progress(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_saved_user_type ON public.saved_items(user_id, content_type);
CREATE INDEX IF NOT EXISTS idx_ai_conv_user ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_msg_conv ON public.ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_mock_results_user ON public.mock_results(user_id, exam_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user ON public.study_sessions(user_id, activity_type);
CREATE INDEX IF NOT EXISTS idx_ai_usage_date ON public.ai_usage_tracking(user_id, usage_date);

-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: User A cannot read or modify User B's data
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_tracking ENABLE ROW LEVEL SECURITY;

-- 11.1 Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 11.2 Student Progress Policies
CREATE POLICY "Users can view own progress"
  ON public.student_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.student_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.student_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- 11.3 Saved Items Policies
CREATE POLICY "Users can view own saved items"
  ON public.saved_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved items"
  ON public.saved_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved items"
  ON public.saved_items FOR DELETE
  USING (auth.uid() = user_id);

-- 11.4 AI Conversations & Messages Policies
CREATE POLICY "Users can view own conversations"
  ON public.ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON public.ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own messages"
  ON public.ai_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON public.ai_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 11.5 Mock Results Policies
CREATE POLICY "Users can view own mock results"
  ON public.mock_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mock results"
  ON public.mock_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 11.6 Study Sessions Policies
CREATE POLICY "Users can view own study sessions"
  ON public.study_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions"
  ON public.study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 11.7 Gamification Policies
CREATE POLICY "Users can view own gamification"
  ON public.user_gamification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification"
  ON public.user_gamification FOR UPDATE
  USING (auth.uid() = user_id);

-- 11.8 AI Usage Policies
CREATE POLICY "Users can view own ai usage"
  ON public.ai_usage_tracking FOR SELECT
  USING (auth.uid() = user_id);

-- ==============================================================================
-- 12. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- Automatically creates row in public.profiles and user_gamification when user signs up
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      updated_at = NOW();

  INSERT INTO public.user_gamification (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 13. REAL EDUCATION DOCUMENT STORAGE & CONTENT INGESTION ARCHITECTURE
-- Distinguishes ORIGINAL_SOURCE_DOCUMENT from EXTRACTED_TEXT and AI_GENERATED_CONTENT
-- ==============================================================================

-- 13.1 SOURCE DOCUMENTS TABLE (Actual stored PDFs, syllabi, books, marking schemes)
CREATE TABLE IF NOT EXISTS public.source_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL, -- e.g. "education/boards/cbse/class-10/science/question-papers/cbse-10-sci-2025.pdf"
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  file_size BIGINT NOT NULL DEFAULT 0,
  board TEXT NOT NULL,
  class_level INT NOT NULL CHECK (class_level IN (10, 11, 12)),
  subject TEXT NOT NULL,
  academic_year TEXT NOT NULL, -- e.g. "2024-2025"
  document_type TEXT NOT NULL CHECK (document_type IN ('book', 'syllabus', 'question_paper', 'marking_scheme', 'sample_paper', 'answer_key')),
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'UNVERIFIED' CHECK (verification_status IN ('UNVERIFIED', 'PROCESSING', 'EXTRACTED', 'NEEDS_REVIEW', 'VERIFIED', 'REJECTED')),
  license_status TEXT NOT NULL DEFAULT 'GOVERNMENT_OPEN_DATA',
  checksum TEXT NOT NULL, -- SHA-256 / 32-bit checksum
  page_count INT DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13.2 QUESTION PAPERS (Metadata for actual past papers)
CREATE TABLE IF NOT EXISTS public.question_papers (
  id TEXT PRIMARY KEY, -- e.g. "cbse-10-sci-2025-31-1-1"
  board TEXT NOT NULL,
  class_level INT NOT NULL CHECK (class_level IN (10, 11, 12)),
  subject TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  exam_year INT NOT NULL,
  exam_type TEXT NOT NULL DEFAULT 'Board Examination',
  paper_code TEXT NOT NULL, -- e.g. "31/1/1"
  set_code TEXT DEFAULT 'Set 1',
  language TEXT DEFAULT 'english',
  maximum_marks INT NOT NULL DEFAULT 80,
  duration_minutes INT NOT NULL DEFAULT 180,
  source_document_id UUID REFERENCES public.source_documents(id) ON DELETE SET NULL,
  source_url TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (verification_status IN ('NEEDS_VERIFICATION', 'VERIFIED', 'AI_GENERATED_PRACTICE')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13.3 EXTRACTED INDEPENDENT QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  paper_id TEXT NOT NULL REFERENCES public.question_papers(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  section TEXT NOT NULL, -- e.g. "Section A", "Section B"
  question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'numerical', 'short_answer', 'long_answer', 'case_based', 'assertion_reason')),
  question_text TEXT NOT NULL,
  marks INT NOT NULL DEFAULT 1,
  page_number INT,
  image_reference TEXT,
  options JSONB, -- [{ "id": "a", "label": "A", "text": "..." }]
  correct_answer TEXT,
  official_marking_scheme JSONB,
  ai_explanation JSONB,
  chapter_id TEXT,
  topic_id TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  source_document_id UUID REFERENCES public.source_documents(id) ON DELETE SET NULL,
  verification_status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (verification_status IN ('OFFICIAL_VERIFIED', 'NEEDS_REVIEW', 'AI_GENERATED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13.4 OFFICIAL SOURCE REGISTRY (Section 3 of Architecture)
CREATE TABLE IF NOT EXISTS public.content_sources (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('official_board', 'official_ncert', 'official_cisce', 'official_nios', 'authorized_publisher', 'public_domain', 'open_license', 'teacher_uploaded', 'admin_uploaded', 'external_reference')),
  official_url TEXT NOT NULL,
  document_url TEXT,
  source_category TEXT NOT NULL CHECK (source_category IN ('curriculum', 'syllabus', 'question_paper', 'marking_scheme', 'sample_paper', 'textbook', 'question_bank')),
  language TEXT NOT NULL DEFAULT 'english',
  class INT CHECK (class IN (10, 11, 12)),
  subject TEXT,
  academic_year TEXT NOT NULL,
  syllabus_year TEXT,
  license_status TEXT NOT NULL DEFAULT 'GOVERNMENT_OPEN_DATA',
  permission_status TEXT NOT NULL DEFAULT 'verified_public' CHECK (permission_status IN ('verified_public', 'fair_use_metadata', 'authorized_redistribution', 'link_only')),
  trust_level TEXT NOT NULL DEFAULT 'LEVEL_1' CHECK (trust_level IN ('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5')),
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  checksum TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'pending_verification', 'offline')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13.5 TEXTBOOKS TABLE (Section 6)
CREATE TABLE IF NOT EXISTS public.books (
  id TEXT PRIMARY KEY, -- e.g. "ncert-class10-science"
  board_id TEXT NOT NULL,
  class_id INT NOT NULL CHECK (class_id IN (10, 11, 12)),
  subject_id TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  publisher TEXT NOT NULL DEFAULT 'NCERT',
  edition TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'english',
  isbn TEXT,
  source_id TEXT REFERENCES public.content_sources(id) ON DELETE SET NULL,
  source_url TEXT NOT NULL,
  storage_path TEXT,
  license_status TEXT NOT NULL DEFAULT 'EDUCATIONAL_FAIR_USE',
  verification_status TEXT NOT NULL DEFAULT 'OFFICIALLY_PUBLISHED',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13.6 BOOK CHAPTERS TABLE
CREATE TABLE IF NOT EXISTS public.book_chapters (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  chapter_title TEXT NOT NULL,
  page_start INT NOT NULL,
  page_end INT NOT NULL,
  source_page_start INT NOT NULL,
  source_page_end INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13.7 BOOK SECTIONS & TOPIC CHUNKS (Preserves exact page references)
CREATE TABLE IF NOT EXISTS public.book_sections (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES public.book_chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  section_number TEXT NOT NULL, -- e.g. "1.2.3"
  page_number INT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'concept' CHECK (content_type IN ('concept', 'experiment', 'example', 'summary', 'intext_question')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13.8 BOOK TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.book_topics (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES public.book_sections(id) ON DELETE CASCADE,
  topic_name TEXT NOT NULL,
  subtopic_name TEXT,
  content TEXT NOT NULL,
  page_number INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13.9 MARKING SCHEMES TABLE (Section 13)
CREATE TABLE IF NOT EXISTS public.marking_schemes (
  id TEXT PRIMARY KEY,
  paper_id TEXT NOT NULL REFERENCES public.question_papers(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  official_marks INT NOT NULL DEFAULT 1,
  marking_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  accepted_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  alternative_answers JSONB DEFAULT '[]'::jsonb,
  source_document TEXT NOT NULL,
  source_page INT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'OFFICIAL_VERIFIED' CHECK (verification_status IN ('OFFICIAL_VERIFIED', 'AI_ASSISTED_EVALUATION', 'NEEDS_REVIEW')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13.10 LEARNING 3D OBJECTS TABLE (Section 27)
CREATE TABLE IF NOT EXISTS public.learning_3d_objects (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  topic TEXT NOT NULL,
  object_name TEXT NOT NULL,
  model_url TEXT NOT NULL,
  description TEXT NOT NULL,
  source TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  related_questions JSONB DEFAULT '[]'::jsonb,
  related_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13.11 IMPORT JOBS TABLE (Background ingestion queue - Section 30)
CREATE TABLE IF NOT EXISTS public.import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT NOT NULL,
  job_type TEXT NOT NULL DEFAULT 'document_ingestion' CHECK (job_type IN ('document_ingestion', 'ocr_extraction', 'pyq_mapping', 'syllabus_import')),
  board TEXT NOT NULL,
  class INT NOT NULL CHECK (class IN (10, 11, 12)),
  subject TEXT NOT NULL,
  year INT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'discovering', 'downloading', 'processing', 'extracting', 'mapping', 'validating', 'review', 'completed', 'failed')),
  progress INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  documents_found INT DEFAULT 0,
  documents_processed INT DEFAULT 0,
  documents_failed INT DEFAULT 0,
  questions_extracted INT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_log JSONB DEFAULT '[]'::jsonb
);

-- 13.12 DOCUMENT INDEXES
CREATE INDEX IF NOT EXISTS idx_content_sources_board ON public.content_sources(board_id, trust_level);
CREATE INDEX IF NOT EXISTS idx_source_docs_board_class ON public.source_documents(board, class_level, subject);
CREATE INDEX IF NOT EXISTS idx_source_docs_checksum ON public.source_documents(checksum);
CREATE INDEX IF NOT EXISTS idx_questions_paper ON public.questions(paper_id);
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON public.questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_marking_schemes_question ON public.marking_schemes(question_id);
CREATE INDEX IF NOT EXISTS idx_book_chapters_book ON public.book_chapters(book_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_learning_3d_subject ON public.learning_3d_objects(subject, chapter);
CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON public.import_jobs(status);

-- 13.13 RLS FOR DOCUMENTS & INGESTION
ALTER TABLE public.content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marking_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_3d_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;

-- Public can read verified documents & questions
CREATE POLICY "Public read content sources" ON public.content_sources FOR SELECT USING (true);
CREATE POLICY "Public read source documents" ON public.source_documents FOR SELECT USING (true);
CREATE POLICY "Public read question papers" ON public.question_papers FOR SELECT USING (true);
CREATE POLICY "Public read questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public read marking schemes" ON public.marking_schemes FOR SELECT USING (true);
CREATE POLICY "Public read books and hierarchy" ON public.books FOR SELECT USING (true);
CREATE POLICY "Public read book chapters" ON public.book_chapters FOR SELECT USING (true);
CREATE POLICY "Public read book sections" ON public.book_sections FOR SELECT USING (true);
CREATE POLICY "Public read book topics" ON public.book_topics FOR SELECT USING (true);
CREATE POLICY "Public read 3d objects" ON public.learning_3d_objects FOR SELECT USING (true);

-- Admins can manage all documents and import jobs
CREATE POLICY "Admins manage content sources" ON public.content_sources FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins manage source documents" ON public.source_documents FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins manage import jobs" ON public.import_jobs FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


