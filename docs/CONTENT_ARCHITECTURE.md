# EDUVERSE AI — CONTENT ARCHITECTURE SPECIFICATION

**Version:** 2.0 Production  
**Scope:** Multi-Board Data Modeling, Content Provenance, Textbook Hierarchy, Question Papers, Marking Schemes, and 3D Learning Objects  

---

## 1. System Philosophy: Real Content First

EduVerse AI strictly enforces:
```
REAL DATA > FAKE DATA
VERIFIED DATA > GENERATED DATA
OFFICIAL SOURCE > RANDOM INTERNET SOURCE
SOURCE PROVENANCE > UNKNOWN CONTENT
CORRECTNESS > SPEED
```

The system segregates four fundamental tiers of content:
1. `OFFICIAL_CONTENT`: Direct reproduction of official board notifications, papers, or marking schemes.
2. `VERIFIED_CONTENT`: Extracted content validated against official answer keys and marking rubrics.
3. `AUTHORIZED_CONTENT`: Licensed publisher or OER material.
4. `AI_GENERATED_CONTENT`: Explicitly marked auxiliary explanations, exam tips, and flashcards grounded on verified syllabus topics.

---

## 2. Core Educational Data Hierarchy

The relational model follows a strict parent-child schema:

```
BOARD (National or State Board)
  ↓
CLASS (10, 11, or 12)
  ↓
ACADEMIC SESSION (e.g. 2025-2026)
  ↓
SYLLABUS (Curriculum blueprint, units, mark weightages)
  ↓
SUBJECT (e.g. Science - SCI086)
  ↓
CHAPTER (e.g. Chapter 5: Life Processes)
  ↓
TOPIC (e.g. 5.2 Nutrition, 5.3 Respiration, 5.4 Transportation)
  ↓
BOOK / SOURCE DOCUMENT (NCERT Rationalized Textbook, CBSE Set 31/1/1)
  ↓
CONTENT / EXTRACTED QUESTION
  ↓
ANSWER KEY / OFFICIAL MARKING SCHEME
  ↓
AI EXPLANATION (Grounding strictly verified)
  ↓
MOCK EXAM / PRACTICE SIMULATION
  ↓
STUDENT PROGRESS & ANALYTICS
```

---

## 3. Database Schema Definitions (Supabase PostgreSQL)

### 3.1 Content Sources Registry (`content_sources`)
- `id`: Unique identifier (e.g. `src-cbse-pyq-archive`)
- `board_id`: Foreign board identifier
- `source_name`: Authority title
- `source_type`: `official_board`, `official_ncert`, `official_cisce`, `official_nios`, etc.
- `official_url`: Canonical authority portal
- `document_url`: Direct resource/archive URL
- `source_category`: `curriculum`, `syllabus`, `question_paper`, `marking_scheme`, `textbook`, `question_bank`
- `language`: `english`, `hindi`, `marathi`, `punjabi`, etc.
- `trust_level`: `LEVEL_1` (Govt/Board), `LEVEL_2` (Authorized), `LEVEL_3` (Open), `LEVEL_4` (Admin Verified), `LEVEL_5` (Unverified)
- `checksum`: SHA-256 cryptographic hash of source document
- `status`: `active`, `deprecated`, `pending_verification`, `offline`

### 3.2 Real Book / Textbook Hierarchy (`books` → `book_chapters` → `book_sections` → `book_topics`)
- **`books`**: `id`, `board_id`, `class_id`, `subject_id`, `title`, `publisher`, `edition`, `academic_year`, `language`, `source_url`, `published`
- **`book_chapters`**: `id`, `book_id`, `chapter_number`, `chapter_title`, `page_start`, `page_end`, `source_page_start`, `source_page_end`
- **`book_sections`**: `id`, `chapter_id`, `title`, `section_number`, `page_number`, `content`, `content_type`
- **`book_topics`**: `id`, `section_id`, `topic_name`, `subtopic_name`, `content`, `page_number`

### 3.3 Question Papers & Questions (`question_papers` → `questions` → `marking_schemes`)
- **`question_papers`**: `id`, `boardId`, `classLevel`, `subjectId`, `year`, `paperCode`, `totalMarks`, `durationMinutes`, `contentStatus`, `isExtractionIncomplete`, `totalQuestionsExpected`, `verifiedQuestionsCount`, `checksum`
- **`questions`**: `id`, `paperId`, `questionNumber`, `section`, `type`, `text`, `marks`, `options`, `correctAnswer`, `answerSource`, `sourcePageNumber`, `chapterName`, `topicName`, `contentStatus`
- **`marking_schemes`**: `id`, `paper_id`, `question_id`, `official_marks`, `marking_points`, `accepted_answers`, `alternative_answers`, `source_document`, `source_page`, `verification_status`

### 3.4 3D Learning Objects (`learning_3d_objects`)
- `id`: Object key (e.g. `heart`, `brain`, `lungs`, `kidney`)
- `subject`: `biology`, `physics`, `chemistry`
- `chapter`: Linked syllabus chapter (e.g. `Life Processes`)
- `topic`: Linked topic (e.g. `Transportation in Human Beings`)
- `object_name`: Display name
- `model_url`: 3D asset URL / procedural canvas shader
- `related_questions`: Array of question IDs linking to this 3D model
- `verified`: Boolean provenance certification

---

## 4. Dual-View Question Paper Architecture

EduVerse AI implements a dual-view interface for students and teachers:

1. **Original Document View (`[📄 ORIGINAL DOCUMENT]`)**:
   - Renders authentic high-resolution digitized pages with page jump, zoom controls (75% to 150%), text search, and link to official board source.
   - Preserves original page layout, mathematical typography, diagrams, and examiner instructions.

2. **Structured Questions View (`[🧩 STRUCTURED QUESTIONS]`)**:
   - Renders independently extracted questions categorized by Sections (A through E).
   - Enforces a 4-tier answer display:
     - Tier 1: Authentic Question Text & Marks
     - Tier 2: Official Answer Key (strictly separated)
     - Tier 3: Official Marking Scheme Rubrics (0.5M step breakdowns)
     - Tier 4: AI Insights & Common Student Pitfalls (grounded on verified syllabus)

---

## 5. Security & Access Control

- **Server-Side API Keys:** `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` reside exclusively on server runtimes; never sent to frontend bundles.
- **Row Level Security (RLS):**
  - Public `SELECT` allowed on `OFFICIAL_VERIFIED` documents, books, and questions.
  - `INSERT`, `UPDATE`, `DELETE` restricted to authenticated `admin` profiles via RLS policy `EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')`.
