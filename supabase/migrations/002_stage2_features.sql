-- =========================================================
-- EDUVERSE AI DATABASE MIGRATION - SCHEMA v2.0 (STAGE 2)
-- Adaptive AI Study Planner, 3D Gamification, XP Transactions,
-- Spaced Repetition Flashcard Schedules & User Preferences
-- =========================================================

-- 1. ADAPTIVE STUDY PLAN TASKS
CREATE TYPE task_type AS ENUM (
  'concept_learning',
  'practice_questions',
  'revision_session',
  'mock_exam',
  'pyq_drill',
  'formula_mastery'
);

CREATE TABLE IF NOT EXISTS public.study_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  chapter_title TEXT,
  task_type task_type DEFAULT 'concept_learning',
  estimated_minutes INT DEFAULT 30,
  is_completed BOOLEAN DEFAULT FALSE,
  scheduled_date DATE DEFAULT CURRENT_DATE,
  priority TEXT DEFAULT 'medium',
  reason_recommended TEXT,
  action_url TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ACHIEVEMENTS & GAMIFICATION
CREATE TYPE trophy_model AS ENUM ('gold_medal', 'prism', 'atom', 'crystal', 'flame', 'shield');

CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Award',
  trophy_model trophy_model DEFAULT 'gold_medal',
  xp_reward INT DEFAULT 100,
  criteria_requirement TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT REFERENCES public.achievements(id) ON DELETE CASCADE,
  is_unlocked BOOLEAN DEFAULT FALSE,
  progress_percentage INT DEFAULT 0,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  reason TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'exam', 'tutor_chat', 'flashcards', 'streak', 'task'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SPACED REPETITION FLASHCARD TRACKING
CREATE TABLE IF NOT EXISTS public.flashcard_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  flashcard_id TEXT NOT NULL,
  ease_factor NUMERIC(3,2) DEFAULT 2.50,
  interval_days INT DEFAULT 1,
  repetition_count INT DEFAULT 0,
  next_review_date DATE DEFAULT CURRENT_DATE,
  last_reviewed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'learning',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, flashcard_id)
);

-- 4. USER SETTINGS & PERSONALIZATION
CREATE TABLE IF NOT EXISTS public.user_settings (
  student_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  graphic_intensity TEXT DEFAULT 'full_3d',
  companion_avatar TEXT DEFAULT 'nebula_core',
  theme_accent TEXT DEFAULT 'cyan',
  voice_enabled BOOLEAN DEFAULT FALSE,
  sound_effects_enabled BOOLEAN DEFAULT TRUE,
  reduced_motion BOOLEAN DEFAULT FALSE,
  daily_goal_hours NUMERIC(3,1) DEFAULT 2.0,
  gamification_visible BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage own tasks" ON public.study_tasks FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Students can view own achievements" ON public.student_achievements FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Students can view own xp" ON public.xp_transactions FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Students can manage own flashcard schedules" ON public.flashcard_schedules FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Students can manage own settings" ON public.user_settings FOR ALL USING (auth.uid() = student_id);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view achievements" ON public.achievements FOR SELECT USING (true);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_tasks_student_date ON public.study_tasks(student_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_flashcards_student_due ON public.flashcard_schedules(student_id, next_review_date);
