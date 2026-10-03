"use client";

import { useEffect, useState } from "react";
import {
  ExamAttempt,
  SavedNote,
  AIConversation,
  QuestionPaper,
  MockExam,
  SubjectProgress,
  StudyActivity,
  StudyTask,
  Achievement,
  StudentGamificationState,
  UserSettings,
  Flashcard,
} from "@/types";
import {
  QUESTION_PAPERS,
  MOCK_EXAMS,
  CHAPTERS,
  SUBJECTS,
  INITIAL_STUDY_TASKS,
  INITIAL_ACHIEVEMENTS,
  DEFAULT_USER_SETTINGS,
  FLASHCARDS,
} from "@/lib/data/mock-db";

const ATTEMPTS_KEY = "eduverse_exam_attempts";
const BOOKMARKS_KEY = "eduverse_bookmarked_papers";
const NOTES_KEY = "eduverse_saved_notes";
const CHATS_KEY = "eduverse_ai_chats";
const PAPERS_KEY = "eduverse_admin_papers";
const EXAMS_KEY = "eduverse_custom_exams";
const TASKS_KEY = "eduverse_study_tasks";
const ACHIEVEMENTS_KEY = "eduverse_achievements";
const SETTINGS_KEY = "eduverse_user_settings";
const FLASHCARDS_KEY = "eduverse_flashcards_queue";

// Default seed exam attempt for rich initial charts
const INITIAL_ATTEMPTS: ExamAttempt[] = [
  {
    id: "attempt-seed-01",
    examId: "mock-cbse10-sci-full",
    examTitle: "CBSE Class 10 Science Grand Mock Test",
    studentId: "demo-student-001",
    subjectId: "cbse-10-sci",
    subjectName: "Science",
    startedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2 + 2700000).toISOString(),
    score: 29,
    totalMarks: 35,
    percentage: 82.8,
    timeSpentSeconds: 2700,
    accuracyRate: 85,
    status: "completed",
    responses: {
      "mock-q1": { questionId: "mock-q1", answer: "b", isCorrect: true, marksAwarded: 1 },
      "mock-q2": { questionId: "mock-q2", answer: "c", isCorrect: true, marksAwarded: 1 },
      "mock-q3": { questionId: "mock-q3", answer: "a", isCorrect: true, marksAwarded: 1 },
      "mock-q4": { questionId: "mock-q4", answer: "48", isCorrect: true, marksAwarded: 3 },
      "mock-q5": { questionId: "mock-q5", answer: "a", isCorrect: true, marksAwarded: 1 },
    },
    topicBreakdown: [
      { topic: "Chemical Reactions", correct: 2, total: 2, accuracy: 100 },
      { topic: "Light & Optics", correct: 1, total: 1, accuracy: 100 },
      { topic: "Electricity", correct: 1, total: 1, accuracy: 100 },
      { topic: "Life Processes", correct: 1, total: 1, accuracy: 100 },
    ],
  },
  {
    id: "attempt-seed-02",
    examId: "mock-cbse10-mat-ch1",
    examTitle: "Class 10 Mathematics Chapter Diagnostic",
    studentId: "demo-student-001",
    subjectId: "cbse-10-math",
    subjectName: "Mathematics",
    startedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 5 + 1800000).toISOString(),
    score: 22,
    totalMarks: 25,
    percentage: 88.0,
    timeSpentSeconds: 1800,
    accuracyRate: 88,
    status: "completed",
    responses: {},
    topicBreakdown: [
      { topic: "Real Numbers", correct: 4, total: 5, accuracy: 80 },
    ],
  }
];

const INITIAL_NOTES: SavedNote[] = [
  {
    id: "note-1",
    studentId: "demo-student-001",
    title: "Light: Mirror vs Lens Sign Conventions Summary",
    subjectId: "cbse-10-sci",
    chapterId: "ch-sci10-09",
    content: "• u is ALWAYS negative in all situations.\n• Concave mirror: focal length f is NEGATIVE; Convex mirror: f is POSITIVE.\n• Convex lens: f is POSITIVE; Concave lens: f is NEGATIVE.\n• Magnification m = -v/u for mirrors, m = +v/u for lenses.",
    noteType: "ai_generated",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "note-2",
    studentId: "demo-student-001",
    title: "Reactivity Series Mnemonic",
    subjectId: "cbse-10-sci",
    chapterId: "ch-sci10-01",
    content: "Please Stop Calling Me A Careless Zebra Instead Try Learning How Copper Saves Gold.\n(K, Na, Ca, Mg, Al, C, Zn, Fe, Pb, H, Cu, Ag, Au).",
    noteType: "mnemonic",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  }
];

export function useDataStore() {
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [allPapers, setAllPapers] = useState<QuestionPaper[]>(QUESTION_PAPERS);
  const [allExams, setAllExams] = useState<MockExam[]>(MOCK_EXAMS);
  const [tasks, setTasks] = useState<StudyTask[]>(INITIAL_STUDY_TASKS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [flashcardDeck, setFlashcardDeck] = useState<Flashcard[]>(FLASHCARDS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      // Attempts
      const storedAttempts = localStorage.getItem(ATTEMPTS_KEY);
      if (storedAttempts) {
        setAttempts(JSON.parse(storedAttempts));
      } else {
        setAttempts(INITIAL_ATTEMPTS);
        localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(INITIAL_ATTEMPTS));
      }

      // Bookmarks
      const storedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      } else {
        const initial = ["pyq-cbse10-sci-2025", "pyq-cbse10-mat-2024"];
        setBookmarks(initial);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(initial));
      }

      // Notes
      const storedNotes = localStorage.getItem(NOTES_KEY);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        setNotes(INITIAL_NOTES);
        localStorage.setItem(NOTES_KEY, JSON.stringify(INITIAL_NOTES));
      }

      // Tasks
      const storedTasks = localStorage.getItem(TASKS_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks(INITIAL_STUDY_TASKS);
        localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_STUDY_TASKS));
      }

      // Achievements
      const storedAch = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (storedAch) {
        setAchievements(JSON.parse(storedAch));
      } else {
        setAchievements(INITIAL_ACHIEVEMENTS);
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(INITIAL_ACHIEVEMENTS));
      }

      // Settings
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        setUserSettings(JSON.parse(storedSettings));
      } else {
        setUserSettings(DEFAULT_USER_SETTINGS);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_USER_SETTINGS));
      }

      // Flashcards
      const storedFlashcards = localStorage.getItem(FLASHCARDS_KEY);
      if (storedFlashcards) {
        setFlashcardDeck(JSON.parse(storedFlashcards));
      } else {
        setFlashcardDeck(FLASHCARDS);
        localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(FLASHCARDS));
      }

      // Admin custom papers
      const storedPapers = localStorage.getItem(PAPERS_KEY);
      if (storedPapers) {
        const parsed: QuestionPaper[] = JSON.parse(storedPapers);
        setAllPapers([...parsed, ...QUESTION_PAPERS.filter(p => !parsed.some(ap => ap.id === p.id))]);
      }

      // Custom Exams
      const storedExams = localStorage.getItem(EXAMS_KEY);
      if (storedExams) {
        const parsed: MockExam[] = JSON.parse(storedExams);
        setAllExams([...parsed, ...MOCK_EXAMS.filter(e => !parsed.some(ae => ae.id === e.id))]);
      }
    } catch (e) {
      console.error("Failed to load local storage store", e);
    } finally {
      setIsReady(true);
    }
  }, []);

  const saveAttempt = (newAttempt: ExamAttempt) => {
    setAttempts(prev => {
      const updated = [newAttempt, ...prev.filter(a => a.id !== newAttempt.id)];
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(updated));
      return updated;
    });

    // Check achievement unlock for score >= 90%
    if (newAttempt.percentage >= 90) {
      unlockAchievement("PERFECTIONIST_90");
    }
  };

  const toggleBookmark = (paperId: string) => {
    setBookmarks(prev => {
      const exists = prev.includes(paperId);
      const updated = exists ? prev.filter(id => id !== paperId) : [...prev, paperId];
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const saveNote = (note: Omit<SavedNote, "id" | "createdAt">) => {
    const newNote: SavedNote = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => {
      const updated = [newNote, ...prev];
      localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
      return updated;
    });
    return newNote;
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => {
      const updated = prev.filter(n => n.id !== noteId);
      localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Study Task Handlers
  const toggleTaskCompleted = (taskId: string) => {
    setTasks(prev => {
      const updated = prev.map(t => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
      localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const addCustomTask = (task: Omit<StudyTask, "id">) => {
    const newTask: StudyTask = {
      ...task,
      id: `task-${Date.now()}`,
    };
    setTasks(prev => {
      const updated = [newTask, ...prev];
      localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
      return updated;
    });
    return newTask;
  };

  const rescheduleTask = (taskId: string, newDate: string) => {
    setTasks(prev => {
      const updated = prev.map(t => (t.id === taskId ? { ...t, scheduledDate: newDate } : t));
      localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Achievement and XP system
  const unlockAchievement = (code: string) => {
    setAchievements(prev => {
      const updated = prev.map(a =>
        a.code === code ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString(), progressPercentage: 100 } : a
      );
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Calculate Gamification State
  const unlockedAchCount = achievements.filter(a => a.isUnlocked).length;
  const baseXP = unlockedAchCount * 250 + attempts.length * 150 + tasks.filter(t => t.isCompleted).length * 50;
  const currentLevel = Math.floor(baseXP / 400) + 1;
  const nextLevelXp = currentLevel * 400;

  const getLevelTitle = (lvl: number) => {
    if (lvl <= 1) return "Novice Explorer";
    if (lvl === 2) return "Orbit Cadet";
    if (lvl === 3) return "Quantum Scholar";
    if (lvl === 4) return "Galaxy Master";
    return "Cosmic Board Topper";
  };

  const gamificationState: StudentGamificationState = {
    currentXp: baseXP,
    currentLevel,
    levelTitle: getLevelTitle(currentLevel),
    nextLevelXp,
    totalTrophiesUnlocked: unlockedAchCount,
    streakDays: 7,
    leaderboardRank: 14,
    recentXpGains: [
      { reason: "Completed Chapter Test", xp: 150, timestamp: "2h ago" },
      { reason: "Daily Study Streak (7 Days)", xp: 300, timestamp: "1d ago" },
      { reason: "AI Tutor Deep Inquiry", xp: 100, timestamp: "2d ago" },
    ],
  };

  // Spaced Repetition Rating Handler for Flashcards (SM-2 Algorithm)
  const rateFlashcard = (cardId: string, rating: "again" | "good" | "easy") => {
    setFlashcardDeck(prev => {
      const updated = prev.map(card => {
        if (card.id !== cardId) return card;

        let ease = card.easeFactor || 2.5;
        let interval = card.intervalDays || 1;
        let status: "learning" | "review" | "mastered" = card.status || "learning";

        if (rating === "again") {
          ease = Math.max(1.3, ease - 0.2);
          interval = 1;
          status = "learning";
        } else if (rating === "good") {
          interval = Math.round(interval * ease);
          status = "review";
        } else if (rating === "easy") {
          ease += 0.15;
          interval = Math.round(interval * ease * 1.3);
          status = "mastered";
        }

        const nextDate = new Date(Date.now() + interval * 86400000).toISOString().split("T")[0];

        return {
          ...card,
          easeFactor: ease,
          intervalDays: interval,
          nextReviewDate: nextDate,
          status,
        };
      });

      localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // User Settings Update
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setUserSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const addCustomPaper = (paper: QuestionPaper) => {
    setAllPapers(prev => {
      const updated = [paper, ...prev];
      localStorage.setItem(PAPERS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const addCustomExam = (exam: MockExam) => {
    setAllExams(prev => {
      const updated = [exam, ...prev];
      localStorage.setItem(EXAMS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const getSubjectProgressList = (subjectIds: string[]): SubjectProgress[] => {
    return subjectIds.map(subId => {
      const subject = SUBJECTS.find(s => s.id === subId);
      const subAttempts = attempts.filter(a => a.subjectId === subId);
      const subChapters = CHAPTERS.filter(c => c.subjectId === subId);

      const totalChapters = subChapters.length || 10;
      const completedChapters = Math.min(totalChapters, subAttempts.length > 0 ? 3 : 1);
      const percentage = Math.round((completedChapters / totalChapters) * 100);

      const avgScore = subAttempts.length > 0
        ? Math.round(subAttempts.reduce((acc, a) => acc + a.percentage, 0) / subAttempts.length)
        : 80;

      return {
        subjectId: subId,
        subjectName: subject?.name || subId,
        completedChapters,
        totalChapters,
        percentage,
        averageScore: avgScore,
        testsTaken: subAttempts.length,
        weakChapters: subAttempts.length === 0 ? ["All Topics Pending Diagnostic"] : ["Electricity Numericals"],
      };
    });
  };

  return {
    isReady,
    attempts,
    bookmarks,
    notes,
    allPapers,
    allExams,
    tasks,
    achievements,
    gamificationState,
    userSettings,
    flashcardDeck,
    saveAttempt,
    toggleBookmark,
    saveNote,
    deleteNote,
    toggleTaskCompleted,
    addCustomTask,
    rescheduleTask,
    unlockAchievement,
    rateFlashcard,
    updateSettings,
    addCustomPaper,
    addCustomExam,
    getSubjectProgressList,
  };
}
