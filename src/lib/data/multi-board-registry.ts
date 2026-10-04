// ==============================================================================
// EDUVERSE AI — MULTI-BOARD REGISTRY & OFFICIAL SOURCE DISCOVERY ENGINE
// Authoritative catalog of National and Indian State Boards with verified URLs & trust levels
// ==============================================================================

import { BoardRegistryEntry, BoardIdentifier, AcademicClassLevel } from "@/types/education-hierarchy";

export const INDIAN_BOARDS_REGISTRY: BoardRegistryEntry[] = [
  // 1. CBSE (National)
  {
    boardId: "cbse",
    code: "CBSE",
    shortName: "CBSE",
    fullName: "Central Board of Secondary Education",
    authorityName: "Ministry of Education, Government of India",
    headquarters: "New Delhi",
    jurisdiction: "National",
    trustLevel: 5,
    officialUrls: {
      portal: "https://www.cbse.gov.in",
      curriculum: "https://cbseacademic.nic.in/curriculum_2026.html",
      syllabus: "https://cbseacademic.nic.in/curriculum_2026.html",
      questionPapers: "https://www.cbse.gov.in/cbsenew/question-paper.html",
      samplePapers: "https://cbseacademic.nic.in/SQP_CLASSX_2025-26.html",
      markingSchemes: "https://cbseacademic.nic.in/marking_scheme.html",
      textbooks: "https://ncert.nic.in/textbook.php",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Standard 10+2 pattern; 10th AISSE, 12th AISSCE with PCM, PCB, Commerce, and Humanities streams.",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 2. CISCE / ICSE / ISC (National)
  {
    boardId: "cisce",
    code: "CISCE",
    shortName: "ICSE / ISC",
    fullName: "Council for the Indian School Certificate Examinations",
    authorityName: "CISCE Non-Governmental National Education Board",
    headquarters: "New Delhi",
    jurisdiction: "National",
    trustLevel: 5,
    officialUrls: {
      portal: "https://cisce.org",
      curriculum: "https://cisce.org/regulations-and-syllabuses-icse-2026",
      syllabus: "https://cisce.org/regulations-and-syllabuses-isc-2026",
      questionPapers: "https://cisce.org/previous-years-question-papers",
      samplePapers: "https://cisce.org/specimen-question-papers-icse-class-x-2026",
      markingSchemes: "https://cisce.org/analysis-of-pupil-performance",
      textbooks: "https://cisce.org/prescribed-textbooks",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 awards ICSE (Indian Certificate of Secondary Education); Class 12 awards ISC (Indian School Certificate).",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 3. NIOS (National Open Schooling)
  {
    boardId: "nios",
    code: "NIOS",
    shortName: "NIOS",
    fullName: "National Institute of Open Schooling",
    authorityName: "Autonomous Institution under Ministry of Education, Govt. of India",
    headquarters: "Noida, UP",
    jurisdiction: "National",
    trustLevel: 5,
    officialUrls: {
      portal: "https://www.nios.ac.in",
      curriculum: "https://www.nios.ac.in/online-course-material.aspx",
      syllabus: "https://www.nios.ac.in/secondary-course-equivalent-to-class-x.aspx",
      questionPapers: "https://www.nios.ac.in/student-information-section/question-paper-of-previous-year-examination.aspx",
      samplePapers: "https://www.nios.ac.in/sample-question-papers.aspx",
      markingSchemes: "https://www.nios.ac.in/marking-schemes.aspx",
      textbooks: "https://www.nios.ac.in/online-course-material/secondary-courses.aspx",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Secondary Course (Class 10) and Senior Secondary Course (Class 12) with credit-banking & continuous assessment.",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 4. Maharashtra State Board (MSBSHSE)
  {
    boardId: "msbshse",
    code: "MSBSHSE",
    shortName: "Maharashtra Board",
    fullName: "Maharashtra State Board of Secondary and Higher Secondary Education",
    authorityName: "School Education and Sports Department, Government of Maharashtra",
    headquarters: "Pune",
    jurisdiction: "State",
    stateName: "Maharashtra",
    trustLevel: 5,
    officialUrls: {
      portal: "https://mahahsscboard.in",
      curriculum: "https://mahahsscboard.in/syllabus.html",
      syllabus: "https://mahahsscboard.in/mr/syllabus-for-hsc",
      questionPapers: "https://mahahsscboard.in/question_papers.html",
      samplePapers: "https://mahahsscboard.in/model_papers.html",
      markingSchemes: "https://mahahsscboard.in/evaluation_patterns.html",
      textbooks: "https://ebalbharati.in",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 is SSC (Secondary School Certificate); Class 11-12 is Junior College / HSC (Higher Secondary Certificate).",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 5. Uttar Pradesh State Board (UPMSP)
  {
    boardId: "upmsp",
    code: "UPMSP",
    shortName: "UP Board",
    fullName: "Uttar Pradesh Madhyamik Shiksha Parishad",
    authorityName: "Department of Secondary Education, Government of Uttar Pradesh",
    headquarters: "Prayagraj",
    jurisdiction: "State",
    stateName: "Uttar Pradesh",
    trustLevel: 5,
    officialUrls: {
      portal: "https://upmsp.edu.in",
      curriculum: "https://upmsp.edu.in/Syllabus.html",
      syllabus: "https://upmsp.edu.in/ModelPaper.html",
      questionPapers: "https://upmsp.edu.in/PreviousYearPapers.html",
      samplePapers: "https://upmsp.edu.in/ModelPaper.html",
      markingSchemes: "https://upmsp.edu.in/MarkingGuidelines.html",
      textbooks: "https://upmsp.edu.in/ETextBooks.html",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 High School & Class 12 Intermediate examination. World's largest state exam conducting body.",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 6. Karnataka State Board (KSEAB)
  {
    boardId: "kseab",
    code: "KSEAB",
    shortName: "Karnataka Board (SSLC / PUC)",
    fullName: "Karnataka School Examination and Assessment Board",
    authorityName: "Department of School Education and Literacy, Government of Karnataka",
    headquarters: "Bengaluru",
    jurisdiction: "State",
    stateName: "Karnataka",
    trustLevel: 5,
    officialUrls: {
      portal: "https://kseab.karnataka.gov.in",
      curriculum: "https://kseab.karnataka.gov.in/syllabus",
      syllabus: "https://kseab.karnataka.gov.in/puc-syllabus",
      questionPapers: "https://kseab.karnataka.gov.in/previous-papers",
      samplePapers: "https://kseab.karnataka.gov.in/model-question-papers",
      markingSchemes: "https://kseab.karnataka.gov.in/blueprint-scheme-of-valuation",
      textbooks: "https://ktbs.kar.nic.in",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 is SSLC; Classes 11 and 12 are Pre-University Courses (1st PUC & 2nd PUC).",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 7. Tamil Nadu State Board (TNDGE)
  {
    boardId: "tndge",
    code: "TNDGE",
    shortName: "Tamil Nadu Board",
    fullName: "Directorate of Government Examinations, Tamil Nadu",
    authorityName: "School Education Department, Government of Tamil Nadu",
    headquarters: "Chennai",
    jurisdiction: "State",
    stateName: "Tamil Nadu",
    trustLevel: 5,
    officialUrls: {
      portal: "https://dge.tn.gov.in",
      curriculum: "https://dge.tn.gov.in/syllabus",
      syllabus: "https://dge.tn.gov.in/higher-secondary-syllabus",
      questionPapers: "https://dge.tn.gov.in/previous-year-question-papers",
      samplePapers: "https://dge.tn.gov.in/model-question-papers",
      markingSchemes: "https://dge.tn.gov.in/answer-keys",
      textbooks: "https://textbooksonline.tn.nic.in",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 SSLC, Class 11 Higher Secondary First Year (+1), Class 12 Higher Secondary Second Year (+2).",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 8. Andhra Pradesh (BIEAP / BSEAP)
  {
    boardId: "bieap",
    code: "BIEAP",
    shortName: "Andhra Pradesh (SSC / Inter)",
    fullName: "Board of Intermediate Education & Directorate of Government Examinations AP",
    authorityName: "Department of School Education, Government of Andhra Pradesh",
    headquarters: "Vijayawada",
    jurisdiction: "State",
    stateName: "Andhra Pradesh",
    trustLevel: 5,
    officialUrls: {
      portal: "https://bieap.apcfss.in",
      curriculum: "https://bieap.apcfss.in/Syllabus.do",
      syllabus: "https://bse.ap.gov.in",
      questionPapers: "https://bieap.apcfss.in/PastPapers.do",
      samplePapers: "https://bieap.apcfss.in/ModelQuestionPapers.do",
      markingSchemes: "https://bieap.apcfss.in/EvaluationStandards.do",
      textbooks: "https://scert.ap.gov.in",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 SSC; Classes 11 and 12 Junior & Senior Intermediate with bilingual instruction.",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 9. Telangana State Board (TSBIE / BSE Telangana)
  {
    boardId: "tsbie",
    code: "TSBIE",
    shortName: "Telangana Board (SSC / Inter)",
    fullName: "Telangana State Board of Intermediate Education & Directorate of School Education",
    authorityName: "Department of Education, Government of Telangana",
    headquarters: "Hyderabad",
    jurisdiction: "State",
    stateName: "Telangana",
    trustLevel: 5,
    officialUrls: {
      portal: "https://tsbie.cgg.gov.in",
      curriculum: "https://tsbie.cgg.gov.in/syllabus.do",
      syllabus: "https://bse.telangana.gov.in",
      questionPapers: "https://tsbie.cgg.gov.in/previous-papers.do",
      samplePapers: "https://tsbie.cgg.gov.in/model-papers.do",
      markingSchemes: "https://tsbie.cgg.gov.in/schemes-of-evaluation.do",
      textbooks: "https://scert.telangana.gov.in",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 SSC; Classes 11 and 12 Intermediate (General and Vocational streams).",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 10. Bihar School Examination Board (BSEB)
  {
    boardId: "bseb",
    code: "BSEB",
    shortName: "Bihar Board",
    fullName: "Bihar School Examination Board",
    authorityName: "Education Department, Government of Bihar",
    headquarters: "Patna",
    jurisdiction: "State",
    stateName: "Bihar",
    trustLevel: 5,
    officialUrls: {
      portal: "https://biharboardonline.bihar.gov.in",
      curriculum: "https://biharboardonline.bihar.gov.in/Syllabus",
      syllabus: "https://biharboardonline.bihar.gov.in/Matric_Inter_Syllabus",
      questionPapers: "https://biharboardonline.bihar.gov.in/Archive_Papers",
      samplePapers: "https://biharboardonline.bihar.gov.in/Model_Question_Papers",
      markingSchemes: "https://biharboardonline.bihar.gov.in/Marking_Schemes",
      textbooks: "https://scert.bihar.gov.in/textbooks",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 Matriculation & Class 12 Intermediate (I.Sc., I.Com., I.A.) examinations.",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 11. West Bengal (WBBSE / WBCHSE)
  {
    boardId: "wbchse",
    code: "WBCHSE",
    shortName: "West Bengal Board",
    fullName: "West Bengal Board of Secondary Education & Higher Secondary Council",
    authorityName: "School Education Department, Government of West Bengal",
    headquarters: "Kolkata",
    jurisdiction: "State",
    stateName: "West Bengal",
    trustLevel: 5,
    officialUrls: {
      portal: "https://wbchse.wb.gov.in",
      curriculum: "https://wbchse.wb.gov.in/curriculum",
      syllabus: "https://wbbse.wb.gov.in/syllabus",
      questionPapers: "https://wbchse.wb.gov.in/previous-papers",
      samplePapers: "https://wbchse.wb.gov.in/sample-question-set",
      markingSchemes: "https://wbchse.wb.gov.in/answer-guidelines",
      textbooks: "https://wbsed.gov.in/textbooks",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 Madhyamik Pariksha (SE); Class 11 and 12 Higher Secondary Examination (H.S.).",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 12. Rajasthan Board (RBSE / BSER)
  {
    boardId: "rbse",
    code: "RBSE",
    shortName: "Rajasthan Board",
    fullName: "Board of Secondary Education, Rajasthan",
    authorityName: "Department of Education, Government of Rajasthan",
    headquarters: "Ajmer",
    jurisdiction: "State",
    stateName: "Rajasthan",
    trustLevel: 5,
    officialUrls: {
      portal: "https://rajeduboard.rajasthan.gov.in",
      curriculum: "https://rajeduboard.rajasthan.gov.in/Syllabus.htm",
      syllabus: "https://rajeduboard.rajasthan.gov.in/Curriculum2026.htm",
      questionPapers: "https://rajeduboard.rajasthan.gov.in/OldPapers.htm",
      samplePapers: "https://rajeduboard.rajasthan.gov.in/ModelPapers.htm",
      markingSchemes: "https://rajeduboard.rajasthan.gov.in/MarkingPatterns.htm",
      textbooks: "https://rajeduboard.rajasthan.gov.in/Books.htm",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 Secondary Examination; Class 12 Senior Secondary Examination (Science, Commerce, Arts).",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 13. Gujarat Board (GSEB)
  {
    boardId: "gseb",
    code: "GSEB",
    shortName: "Gujarat Board",
    fullName: "Gujarat Secondary and Higher Secondary Education Board",
    authorityName: "Education Department, Government of Gujarat",
    headquarters: "Gandhinagar",
    jurisdiction: "State",
    stateName: "Gujarat",
    trustLevel: 5,
    officialUrls: {
      portal: "https://www.gseb.org",
      curriculum: "https://www.gseb.org/syllabus",
      syllabus: "https://www.gseb.org/hsc-general-science-syllabus",
      questionPapers: "https://www.gseb.org/past-papers",
      samplePapers: "https://www.gseb.org/model-papers",
      markingSchemes: "https://www.gseb.org/blueprints",
      textbooks: "https://www.gsbstmt.org",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 SSC; Class 12 HSC (Science and General Streams with GUJCET integration).",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 14. Kerala Board (KBPE / DHSE)
  {
    boardId: "kbpe",
    code: "KBPE",
    shortName: "Kerala Board (SSLC / DHSE)",
    fullName: "Kerala Board of Public Examinations & Directorate of Higher Secondary Education",
    authorityName: "General Education Department, Government of Kerala",
    headquarters: "Thiruvananthapuram",
    jurisdiction: "State",
    stateName: "Kerala",
    trustLevel: 5,
    officialUrls: {
      portal: "https://keralapareekshabhavan.in",
      curriculum: "https://dhsekerala.gov.in/curriculum",
      syllabus: "https://scert.kerala.gov.in/syllabus",
      questionPapers: "https://keralapareekshabhavan.in/previous-questions",
      samplePapers: "https://dhsekerala.gov.in/sample-questions",
      markingSchemes: "https://dhsekerala.gov.in/scheme-of-valuation",
      textbooks: "https://samagra.kite.kerala.gov.in",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 SSLC; Class 11 and 12 Plus One (+1) & Plus Two (+2) under DHSE.",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 15. Madhya Pradesh Board (MPBSE)
  {
    boardId: "mpbse",
    code: "MPBSE",
    shortName: "MP Board",
    fullName: "Madhya Pradesh Board of Secondary Education",
    authorityName: "School Education Department, Government of Madhya Pradesh",
    headquarters: "Bhopal",
    jurisdiction: "State",
    stateName: "Madhya Pradesh",
    trustLevel: 5,
    officialUrls: {
      portal: "https://mpbse.nic.in",
      curriculum: "https://mpbse.nic.in/syllabus.htm",
      syllabus: "https://mpbse.nic.in/Curriculum_2026.htm",
      questionPapers: "https://mpbse.nic.in/Old_Papers.htm",
      samplePapers: "https://mpbse.nic.in/Model_Paper.htm",
      markingSchemes: "https://mpbse.nic.in/Blue_Print.htm",
      textbooks: "https://mpbse.nic.in/eBooks.htm",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 High School & Class 12 Higher Secondary School Certificate Examination.",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },

  // 16. Punjab School Education Board (PSEB)
  {
    boardId: "pseb",
    code: "PSEB",
    shortName: "Punjab Board",
    fullName: "Punjab School Education Board",
    authorityName: "Department of School Education, Government of Punjab",
    headquarters: "Mohali (SAS Nagar)",
    jurisdiction: "State",
    stateName: "Punjab",
    trustLevel: 5,
    officialUrls: {
      portal: "https://www.pseb.ac.in",
      curriculum: "https://www.pseb.ac.in/syllabus",
      syllabus: "https://www.pseb.ac.in/matric-senior-secondary-syllabus",
      questionPapers: "https://www.pseb.ac.in/previous-year-question-papers",
      samplePapers: "https://www.pseb.ac.in/model-question-paper",
      markingSchemes: "https://www.pseb.ac.in/structure-of-question-paper",
      textbooks: "https://www.pseb.ac.in/e-books",
    },
    supportedClasses: [10, 11, 12],
    classStructureNotes: "Class 10 Matriculation Examination; Class 12 Senior Secondary Examination.",
    activeCurriculumYear: "2025-2026",
    isVerifiedAuthority: true,
  },
];

/**
 * Fast lookup helper for board registry
 */
export function getBoardRegistryEntry(boardIdOrCode: string): BoardRegistryEntry | undefined {
  const normalized = (boardIdOrCode || "").toLowerCase().trim();
  return INDIAN_BOARDS_REGISTRY.find(
    (b) => b.boardId === normalized || b.code.toLowerCase() === normalized || b.shortName.toLowerCase().includes(normalized)
  );
}

/**
 * Filter boards supporting specific class level (10, 11, or 12)
 */
export function getBoardsForClass(classLevel: AcademicClassLevel): BoardRegistryEntry[] {
  return INDIAN_BOARDS_REGISTRY.filter((b) => b.supportedClasses.includes(classLevel));
}
