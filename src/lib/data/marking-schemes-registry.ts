// ==============================================================================
// EDUVERSE AI — OFFICIAL MARKING SCHEMES REGISTRY (Section 13)
// Official scoring rubrics, key points, accepted answers, and source page provenance
// ==============================================================================

import { MarkingSchemeRecord } from "@/types/content-engine";

export const OFFICIAL_MARKING_SCHEMES: MarkingSchemeRecord[] = [
  // Question 1: Chemical Reactions (KI + Pb(NO3)2)
  {
    id: "ms-cbse10-sci-25-01",
    paper_id: "pyq-cbse10-sci-2025",
    question_id: "q-sci10-25-01",
    official_marks: 1,
    marking_points: [
      {
        point: "Identification of yellow color and correct chemical identity PbI2 (Lead iodide)",
        marksAllocated: 1.0,
      },
    ],
    accepted_answers: [
      "(B) Yellow, Lead iodide (PbI₂)",
      "Yellow precipitate of Lead Iodide",
      "PbI2 yellow",
    ],
    alternative_answers: ["Option B"],
    source_document: "doc-cbse10-sci-2025-ms",
    source_page: 2,
    verification_status: "OFFICIAL_VERIFIED",
  },

  // Question 2: Electricity (Bulb rating 220V 100W at 110V)
  {
    id: "ms-cbse10-sci-25-02",
    paper_id: "pyq-cbse10-sci-2025",
    question_id: "q-sci10-25-02",
    official_marks: 1,
    marking_points: [
      {
        point: "Calculation of filament resistance R = V²/P = (220)²/100 = 484 Ω",
        marksAllocated: 0.5,
      },
      {
        point: "Calculation of new power P' = V'²/R = (110)²/484 = 25 W (Option D)",
        marksAllocated: 0.5,
      },
    ],
    accepted_answers: ["(D) 25 W", "25 Watts", "25W"],
    alternative_answers: ["Option D"],
    source_document: "doc-cbse10-sci-2025-ms",
    source_page: 2,
    verification_status: "OFFICIAL_VERIFIED",
  },

  // Question 3: Light (Dentist mirror)
  {
    id: "ms-cbse10-sci-25-03",
    paper_id: "pyq-cbse10-sci-2025",
    question_id: "q-sci10-25-03",
    official_marks: 1,
    marking_points: [
      {
        point: "Correct mirror identification: Concave mirror",
        marksAllocated: 1.0,
      },
    ],
    accepted_answers: ["(C) Concave mirror", "Concave spherical mirror"],
    alternative_answers: ["Option C"],
    source_document: "doc-cbse10-sci-2025-ms",
    source_page: 3,
    verification_status: "OFFICIAL_VERIFIED",
  },

  // Question 21: Light (Snell's Law & Refraction into water)
  {
    id: "ms-cbse10-sci-25-21",
    paper_id: "pyq-cbse10-sci-2025",
    question_id: "q-sci10-25-07",
    official_marks: 2,
    marking_points: [
      {
        point: "Stating Snell's Law: ratio of sin(i) to sin(r) is constant for a given pair of media (sin i / sin r = constant = n)",
        marksAllocated: 1.0,
      },
      {
        point: "Stating that ray bends 'towards the normal' with valid reasoning (water is optically denser / speed of light slows down in water)",
        marksAllocated: 1.0,
      },
    ],
    accepted_answers: [
      "sin i / sin r = constant (refractive index); bends towards the normal because velocity of light decreases in water.",
      "Ratio of sine of angle of incidence to sine of angle of refraction is constant; bends towards the normal as water has higher refractive index than air.",
    ],
    alternative_answers: [
      "sin(i)/sin(r) = n; towards normal because v_water < v_air",
    ],
    source_document: "doc-cbse10-sci-2025-ms",
    source_page: 5,
    verification_status: "OFFICIAL_VERIFIED",
  },

  // Question 34: Biology Life Processes (Heart diagram & double circulation)
  {
    id: "ms-cbse10-sci-25-34",
    paper_id: "pyq-cbse10-sci-2025",
    question_id: "q-sci10-25-34",
    official_marks: 5,
    marking_points: [
      {
        point: "Neat diagram of human heart with proper chambers and partition wall",
        marksAllocated: 1.0,
      },
      {
        point: "Correct labeling: Left ventricle (0.25m), Aorta (0.25m), Pulmonary artery (0.25m), Septum (0.25m)",
        marksAllocated: 1.0,
      },
      {
        point: "Explanation of double circulation (blood travels twice through heart during each complete cardiac cycle: pulmonary loop + systemic loop)",
        marksAllocated: 1.5,
      },
      {
        point: "Necessity: separation of oxygenated and deoxygenated blood maintains high metabolic efficiency and constant body temperature for warm-blooded mammals",
        marksAllocated: 1.5,
      },
    ],
    accepted_answers: [
      "Diagram with 4 labels + Double circulation explanation (pulmonary & systemic circuits) + prevention of mixing for high energy demand in warm-blooded animals.",
    ],
    source_document: "doc-cbse10-sci-2025-ms",
    source_page: 9,
    verification_status: "OFFICIAL_VERIFIED",
  },
];

export function getMarkingSchemeForQuestion(questionId: string): MarkingSchemeRecord | undefined {
  return OFFICIAL_MARKING_SCHEMES.find((ms) => ms.question_id === questionId);
}

export function getMarkingSchemesForPaper(paperId: string): MarkingSchemeRecord[] {
  return OFFICIAL_MARKING_SCHEMES.filter((ms) => ms.paper_id === paperId);
}
