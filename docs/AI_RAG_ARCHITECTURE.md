# EDUVERSE AI — AI RAG ARCHITECTURE & ANTI-HALLUCINATION ENGINE

**Version:** 2.0 Production  
**Component:** Context Retriever, Vector Grounding, Question-Level RAG, Anti-Fabrication Guardrails  

---

## 1. RAG Core Pipeline

EduVerse AI does not use generic chatbot prompting. The AI Tutor and Question Solvers use multi-stage Retrieval-Augmented Generation (RAG):

```
STUDENT PROMPT
      ↓
SESSION & ROLE AUTHENTICATION
      ↓
CURRENT PAGE CONTEXT CAPTURE (Board, Class, Subject, Chapter, Topic, Paper, Question)
      ↓
SUBJECT CLASSIFIER (Math, Physics, Chemistry, Biology, History, Geography)
      ↓
INTENT RESOLUTION (Question Explanation vs Concept Explanation vs Board Blueprint)
      ↓
DATABASE RETRIEVAL
   ├── 1. Exact Question Text & Marks
   ├── 2. Official Answer Key
   ├── 3. Official Marking Scheme (Step Rubric)
   ├── 4. Source Document Page Reference
   ├── 5. NCERT Rationalized Textbook Section
   └── 6. Related 3D Object Metadata
      ↓
RELEVANCE RANKING & ISOLATION CHECK
   ├── Board Boundary Guardrail (e.g. CBSE 10 vs ICSE 10)
   ├── Class Boundary Guardrail (Class 10 vs Class 12)
   └── Anti-Fabrication Check (Verify existence in DB)
      ↓
RAG CONTEXT ASSEMBLY (System Prompt + Grounded Chunks)
      ↓
LLM INFERENCE (Gemini 2.5 Flash / Server-Side Engine)
      ↓
POST-INFERENCE SANITIZATION & MARKDOWN FORMATTING
      ↓
DELIVERY TO STUDENT WITH TRANSPARENT ATTRIBUTION
```

---

## 2. Anti-Hallucination & Zero-Fabrication Rules

### Rule 1: Non-Existent Question Rejection
If a student asks:
> *"Show me CBSE Class 10 Science 2025 question 24."*

The system executes a query against `public.questions` where `paper_id = 'pyq-cbse10-sci-2025'` and `question_number = 24`.  
- **If Q24 exists:** The verified question text is returned with official marks and marking scheme.
- **If Q24 does not exist in the database:** The system outputs:
  > *"I could not find a verified Question 24 in the imported 2025 paper. This paper currently has 5 verified questions indexed, with remaining questions queued in our background ingestion pipeline."*
  **The AI is explicitly forbidden from inventing a replacement question.**

### Rule 2: Cancelled Exam Historical Truth (2021 COVID-19)
If a student asks:
> *"Give me the 2021 CBSE Class 10 Science board question paper."*

The system retrieves the official historical notice:
> *"CBSE officially cancelled Class 10 Board Examinations in 2021 due to the COVID-19 pandemic. Results were compiled using internal objective assessment criteria. No official board examination paper was administered."*
**The system never hallucinates a fake 2021 paper.**

### Rule 3: Strict Separation of Official vs AI Answers
Every question solver outputs:
1. `[Official Answer]`: Sourced directly from the official board release.
2. `[Official Marking Scheme]`: Sourced from the official scoring key.
3. `[AI Explanation]`: Clearly labeled as *"AI-assisted conceptual breakdown"*, never claiming to be the official answer.

---

## 3. Structured Output Format for Question Solver

When a student clicks **"Ask AI About This Question"**, the response adheres to a strict 8-point structure:

1. **What the Question Asks:** Direct paraphrase of the examiner's core requirement.
2. **Key Scientific Concept:** Underlying physical, chemical, or biological principle.
3. **Step-by-Step Solution:** Formula application or stepwise deduction matching marking points.
4. **Final Answer:** Concise result with proper scientific units ($A, V, \Omega, \text{cm}$) or balanced equation.
5. **Examiner Writing Tip:** Keyword guidance to secure full marks (e.g. underline 'yellow precipitate').
6. **Common Mistake:** Frequent pitfalls identified in examiner review reports.
7. **Related Syllabus Concept:** Direct link to textbook section (e.g. NCERT Chapter 5, Page 85).
8. **Linked 3D Model:** Interactive link to 3D simulation when applicable (e.g. Human Heart).

---

## 4. Context Isolation & Topic Switching

The `TopicSwitchDetector` monitors conversation trajectories. If a student transitions from:
`CBSE Class 10 Biology (Life Processes)` $\to$ `CBSE Class 10 Physics (Electricity)`
The conversation context vector is cleanly isolated:
- Biology entities are purged from short-term prompt memory.
- Physics formulas ($V = IR, P = V^2/R$) and electrical units are injected into active context.
- Cross-contamination between subjects or boards is strictly prevented.
