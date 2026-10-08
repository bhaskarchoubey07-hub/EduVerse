# EDUVERSE AI — DOCUMENT INGESTION & QUALITY PIPELINE SPECIFICATION

**Version:** 2.0 Production  
**Pipeline:** Ingestion, Deduplication, OCR Quality Assessment, Equation Preservation, Syllabus Mapping, and Verification Workflow  

---

## 1. 21-Step Production Ingestion Pipeline

Every educational document (PDF, HTML, EPUB, scanned exam paper) passes through a 21-step pipeline before publication:

```
[STEP 1]  Source Discovery (Scheduled checker queries official portal registry)
   ↓
[STEP 2]  Source Validation (Validates SSL, official authority domain, and allowed actions)
   ↓
[STEP 3]  Download Permission Check (Verifies Government Open Data or Fair Use status)
   ↓
[STEP 4]  Cryptographic Checksum (Generates SHA-256 fingerprint for immutability)
   ↓
[STEP 5]  Document Storage (Stores in partitioned Supabase Storage bucket: education/{board}/{class}/{subject}/)
   ↓
[STEP 6]  Text Extraction (Extracts embedded text streams with preserved font sizes)
   ↓
[STEP 7]  Diagram & Image Extraction (Extracts circuit diagrams, ray diagrams, anatomical figures)
   ↓
[STEP 8]  Table Extraction (Parses tabular mark distributions, periodic data)
   ↓
[STEP 9]  Mathematical & Chemical Equation Extraction (Preserves LaTeX, sub/superscripts: H₂SO₄, sin i/sin r)
   ↓
[STEP 10] OCR for Scanned Pages (Tesseract / Vision OCR for legacy and handwritten state papers)
   ↓
[STEP 11] Page Number Preservation (Binds every chunk to physical source page: e.g. "Source: Page 7")
   ↓
[STEP 12] Document Structure Detection (Identifies Header, Instructions, Maximum Marks, Duration)
   ↓
[STEP 13] Section Detection (Segments Section A, B, C, D, E based on board blueprints)
   ↓
[STEP 14] Question Boundary Detection (Splits individual questions: Q1 to Q39)
   ↓
[STEP 15] Option Segmentation (Extracts MCQ options A, B, C, D with labels)
   ↓
[STEP 16] Answer Key & Marking Scheme Alignment (Binds question to official marking point)
   ↓
[STEP 17] Syllabus & Curriculum Mapping (Maps question to official board subject & unit code)
   ↓
[STEP 18] Chapter & Topic Resolution (Classifies question to chapter, topic, and subtopic)
   ↓
[STEP 19] Automated Quality & Completeness Validation (Checks question count against total marks)
   ↓
[STEP 20] Verification Status Tagging (OFFICIAL_VERIFIED, EXTRACTION_INCOMPLETE, or OCR_REVIEW)
   ↓
[STEP 21] Publication Gate (Only VERIFIED and PUBLISHED items appear in student search)
```

---

## 2. Incomplete Extraction Handling (Section 10 & 36)

If a source document contains 39 questions but only 5 questions have been extracted and verified with marking rubrics:
- **`status`** is explicitly assigned:
  `contentStatus = "EXTRACTION_INCOMPLETE"`
- **`isVerifiedOfficial`** is set to `false`.
- **UI Banner Displayed:**
  > *"Source imported but extraction is incomplete (5/39 verified questions). This content is not yet verified as a complete paper for student exam simulation."*
- **The paper is never falsely presented as a complete 80-mark examination.**

---

## 3. Storage Hierarchy Standard (Section 8)

Original documents are organized in partitioned, logical paths within Supabase Storage:

```
education/
  cbse/
    class-10/
      science/
        question-papers/
          2025/cbse-10-sci-2025-31-1-1.pdf
          2024/cbse-10-sci-2024-31-1-1.pdf
        marking-schemes/
          2025/cbse-10-sci-2025-marking-scheme.pdf
        textbooks/
          ncert-class10-science-rationalized.pdf
        sample-papers/
          2026/cbse-10-sci-sqp-2026.pdf
  cisce/
    class-10/
      physics/
        question-papers/
          2024/icse-10-phy-2024.pdf
  state-boards/
    pseb/
      class-10/
        science/
          2024/pseb-10-sci-2024-series-a.pdf
```

---

## 4. Duplicate Detection & Content Hash

To prevent duplicate imports:
1. **SHA-256 Checksum:** Cryptographic hash of the raw file binary.
2. **Metadata Key:** Composite key of `board-class-subject-year-paperCode`.
3. If an identical document is submitted, the pipeline marks:
   `duplicate_of = existing_document_id`
   and blocks duplicate database insertion.

---

## 5. Ingestion Error Handling & Failure Logging

Every failure event is recorded in `import_jobs.error_log` with standard error codes:

| Error Code | Description | Automated Recovery Action |
| :--- | :--- | :--- |
| `SOURCE_NOT_FOUND` | Official URL returned 404 or connection timed out | Enqueue retry with exponential backoff (3 attempts) |
| `ACCESS_DENIED` | Source portal returned 403 or anti-scraping block | Alert administrator; switch to manual verified upload |
| `INVALID_PDF` | Corrupted header or unparseable binary | Move file to quarantine bucket |
| `OCR_FAILED` | Scanned page resolution below 150 DPI | Flag status as `OCR_REVIEW_REQUIRED` |
| `QUESTION_EXTRACTION_FAILED` | Question numbering broke or skipped | Retain partial extraction as `EXTRACTION_INCOMPLETE` |
| `LICENSE_REVIEW_REQUIRED` | Source copyright status ambiguous | Restrict to `LINK_ONLY` and metadata display |
