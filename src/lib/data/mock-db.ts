import {
  Board,
  Subject,
  Chapter,
  QuestionPaper,
  MockExam,
  ExamQuestion,
  Flashcard,
} from "@/types";

export const BOARDS: Board[] = [
  {
    id: "cbse",
    code: "cbse",
    name: "Central Board of Secondary Education",
    shortName: "CBSE",
    description: "National board following NCERT curriculum with competency-based assessment and nationwide recognition.",
    logoText: "CBSE",
    availableClasses: [10, 11, 12],
    activeSessions: ["2026-2027", "2025-2026", "2024-2025"],
  },
  {
    id: "icse",
    code: "icse",
    name: "Council for the Indian School Certificate Examinations (ICSE / ISC)",
    shortName: "ICSE / ISC",
    description: "Comprehensive analytical curriculum with rigorous emphasis on English, sciences, literature, and practical applications.",
    logoText: "CISCE",
    availableClasses: [10, 11, 12],
    activeSessions: ["2026-2027", "2025-2026"],
  },
  {
    id: "pseb",
    code: "pseb",
    name: "Punjab School Education Board",
    shortName: "PSEB",
    description: "State curriculum board of Punjab prioritizing state syllabus benchmarks, bilingual learning, and practical skills.",
    logoText: "PSEB",
    availableClasses: [10, 11, 12],
    state: "Punjab",
    activeSessions: ["2026-2027", "2025-2026"],
  },
  {
    id: "state_board",
    code: "state_board",
    name: "State Secondary & Higher Secondary Education Boards",
    shortName: "State Boards",
    description: "Modular curriculum aligned with state-specific board patterns including UP Board, Maharashtra SSC/HSC, and Karnataka KSEEB.",
    logoText: "STATE",
    availableClasses: [10, 11, 12],
    activeSessions: ["2026-2027"],
  },
];

export const SUBJECTS: Subject[] = [
  // Class 10 CBSE
  {
    id: "cbse-10-sci",
    code: "SCI086",
    name: "Science (Physics, Chem, Bio)",
    boardId: "cbse",
    classLevel: 10,
    iconName: "Atom",
    color: "cyan",
    chapterCount: 13,
    totalMarks: 100,
    theoryMarks: 80,
    practicalMarks: 20,
    description: "Chemical Substances, World of Living, Natural Phenomena, Effects of Current, and Natural Resources.",
  },
  {
    id: "cbse-10-math",
    code: "MAT041",
    name: "Mathematics (Standard / Basic)",
    boardId: "cbse",
    classLevel: 10,
    iconName: "Calculator",
    color: "violet",
    chapterCount: 14,
    totalMarks: 100,
    theoryMarks: 80,
    practicalMarks: 20,
    description: "Number Systems, Algebra, Coordinate Geometry, Geometry, Trigonometry, Mensuration, Statistics & Probability.",
  },
  {
    id: "cbse-10-sst",
    code: "SST087",
    name: "Social Science",
    boardId: "cbse",
    classLevel: 10,
    iconName: "Globe",
    color: "amber",
    chapterCount: 20,
    totalMarks: 100,
    theoryMarks: 80,
    practicalMarks: 20,
    description: "India & Contemporary World II, Contemporary India II, Democratic Politics II, and Understanding Economic Development.",
  },
  {
    id: "cbse-10-eng",
    code: "ENG184",
    name: "English Language & Literature",
    boardId: "cbse",
    classLevel: 10,
    iconName: "BookOpen",
    color: "blue",
    chapterCount: 18,
    totalMarks: 100,
    theoryMarks: 80,
    practicalMarks: 20,
    description: "Reading Comprehension, Writing Skills, Integrated Grammar, First Flight and Footprints Without Feet.",
  },

  // Class 12 CBSE (Science Stream)
  {
    id: "cbse-12-phy",
    code: "PHY042",
    name: "Physics",
    boardId: "cbse",
    classLevel: 12,
    iconName: "Zap",
    color: "violet",
    chapterCount: 14,
    totalMarks: 100,
    theoryMarks: 70,
    practicalMarks: 30,
    description: "Electrostatics, Current Electricity, Magnetic Effects, Optics, Dual Nature, Atoms, Nuclei, and Semiconductor Devices.",
  },
  {
    id: "cbse-12-chem",
    code: "CHE043",
    name: "Chemistry",
    boardId: "cbse",
    classLevel: 12,
    iconName: "FlaskConical",
    color: "cyan",
    chapterCount: 10,
    totalMarks: 100,
    theoryMarks: 70,
    practicalMarks: 30,
    description: "Solutions, Electrochemistry, Chemical Kinetics, d & f Block Elements, Coordination Compounds, Organic Haloalkanes, Alcohols, Aldehydes & Biomolecules.",
  },
  {
    id: "cbse-12-math",
    code: "MAT041",
    name: "Mathematics",
    boardId: "cbse",
    classLevel: 12,
    iconName: "Binary",
    color: "blue",
    chapterCount: 13,
    totalMarks: 100,
    theoryMarks: 80,
    practicalMarks: 20,
    description: "Relations & Functions, Matrices, Calculus (Derivatives & Integrals), Vectors, 3D Geometry, Linear Programming, and Probability.",
  },
  {
    id: "cbse-12-bio",
    code: "BIO044",
    name: "Biology",
    boardId: "cbse",
    classLevel: 12,
    iconName: "Dna",
    color: "emerald",
    chapterCount: 13,
    totalMarks: 100,
    theoryMarks: 70,
    practicalMarks: 30,
    description: "Reproduction, Genetics and Evolution, Biology in Human Welfare, Biotechnology and its Applications, Ecology and Environment.",
  },
  {
    id: "cbse-12-acc",
    code: "ACC055",
    name: "Accountancy",
    boardId: "cbse",
    classLevel: 12,
    iconName: "BarChart3",
    color: "amber",
    chapterCount: 11,
    totalMarks: 100,
    theoryMarks: 80,
    practicalMarks: 20,
    description: "Accounting for Partnership Firms, Accounting for Companies, Analysis of Financial Statements, Cash Flow Statement.",
  },

  // Class 10 ICSE
  {
    id: "icse-10-phy",
    code: "ICSE_PHY",
    name: "Physics (Science Paper 1)",
    boardId: "icse",
    classLevel: 10,
    iconName: "Zap",
    color: "violet",
    chapterCount: 12,
    totalMarks: 100,
    theoryMarks: 80,
    practicalMarks: 20,
    description: "Force, Work, Power and Energy, Light, Sound, Electricity and Magnetism, Heat, Modern Physics.",
  },
  {
    id: "icse-10-math",
    code: "ICSE_MAT",
    name: "Mathematics",
    boardId: "icse",
    classLevel: 10,
    iconName: "Calculator",
    color: "cyan",
    chapterCount: 16,
    totalMarks: 100,
    theoryMarks: 80,
    practicalMarks: 20,
    description: "Commercial Mathematics (GST, Banking), Algebra, Coordinate Geometry, Geometry, Mensuration, Trigonometry, Statistics & Probability.",
  },

  // PSEB Class 10 & 12
  {
    id: "pseb-10-sci",
    code: "PSEB_SCI",
    name: "Science (ਵਿਗਿਆਨ)",
    boardId: "pseb",
    classLevel: 10,
    iconName: "Atom",
    color: "emerald",
    chapterCount: 13,
    totalMarks: 100,
    theoryMarks: 80,
    practicalMarks: 20,
    description: "Punjab Board standard Science syllabus with bilingual English/Punjabi learning tracks and board patterns.",
  },
  {
    id: "pseb-12-math",
    code: "PSEB_MAT12",
    name: "Mathematics",
    boardId: "pseb",
    classLevel: 12,
    iconName: "Binary",
    color: "blue",
    chapterCount: 13,
    totalMarks: 100,
    theoryMarks: 80,
    practicalMarks: 20,
    description: "Calculus, Vectors, Three Dimensional Geometry, and Probability as per PSEB Senior Secondary guidelines.",
  },
];

export const CHAPTERS: Chapter[] = [
  // Class 10 Science (CBSE)
  {
    id: "ch-sci10-01",
    subjectId: "cbse-10-sci",
    number: 1,
    title: "Chemical Reactions and Equations",
    description: "Types of chemical reactions, balancing chemical equations, oxidation and reduction, corrosion and rancidity.",
    marksWeightage: 7,
    estimatedHours: 4,
    topics: [
      { id: "top-sci10-01-1", chapterId: "ch-sci10-01", title: "Balancing Chemical Equations", importance: "high", isCompleted: true },
      { id: "top-sci10-01-2", chapterId: "ch-sci10-01", title: "Combination, Decomposition & Displacement Reactions", importance: "high", isCompleted: true },
      { id: "top-sci10-01-3", chapterId: "ch-sci10-01", title: "Redox Reactions (Oxidation & Reduction)", importance: "high", isCompleted: false },
      { id: "top-sci10-01-4", chapterId: "ch-sci10-01", title: "Corrosion and Prevention of Rancidity", importance: "medium", isCompleted: false },
    ],
    keyFormulas: [
      "Rusting of Iron: 4Fe + 3O₂ + xH₂O → 2Fe₂O₃·xH₂O",
      "Respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy",
      "Slaking of Lime: CaO + H₂O → Ca(OH)₂ + Heat",
      "Limewater Test: Ca(OH)₂ + CO₂ → CaCO₃↓ (Milky) + H₂O",
    ],
    keyDefinitions: [
      { term: "Endothermic Reaction", definition: "A reaction in which energy is absorbed from the surroundings in the form of heat, light or electricity." },
      { term: "Redox Reaction", definition: "A reaction in which one reactant undergoes oxidation (loss of electrons/gain of oxygen) while another undergoes reduction." },
      { term: "Precipitation Reaction", definition: "Any reaction that produces an insoluble solid (precipitate) when two aqueous solutions are mixed." }
    ],
    mnemonics: [
      {
        title: "OIL RIG (Redox)",
        trick: "Oxidation Is Loss, Reduction Is Gain",
        explanation: "Oxidation is loss of electrons or gain of oxygen; Reduction is gain of electrons or loss of oxygen."
      },
      {
        title: "Reactivity Series: Please Stop Calling Me A Careless Zebra",
        trick: "K > Na > Ca > Mg > Al > C > Zn > Fe > Pb > H > Cu > Ag > Au",
        explanation: "Potassium, Sodium, Calcium, Magnesium, Aluminium, Carbon, Zinc, Iron, Lead, Hydrogen, Copper, Silver, Gold."
      }
    ],
    summary: "Chemical reactions involve breaking and making of chemical bonds to form new substances. Equations must follow the Law of Conservation of Mass and be balanced. Reactions are classified into combination, decomposition (thermal, electrolytic, photolytic), displacement, double displacement, and redox reactions."
  },
  {
    id: "ch-sci10-02",
    subjectId: "cbse-10-sci",
    number: 2,
    title: "Acids, Bases and Salts",
    description: "Properties of acids and bases, pH scale in daily life, preparation and uses of Bleaching Powder, Baking Soda, Washing Soda, and Plaster of Paris.",
    marksWeightage: 8,
    estimatedHours: 5,
    topics: [
      { id: "top-sci10-02-1", chapterId: "ch-sci10-02", title: "Indicators and Chemical Properties of Acids/Bases", importance: "high", isCompleted: true },
      { id: "top-sci10-02-2", chapterId: "ch-sci10-02", title: "pH Scale and its Importance in Everyday Life", importance: "high", isCompleted: false },
      { id: "top-sci10-02-3", chapterId: "ch-sci10-02", title: "Salts: Bleaching Powder, Baking & Washing Soda", importance: "high", isCompleted: false },
      { id: "top-sci10-02-4", chapterId: "ch-sci10-02", title: "Plaster of Paris (POP) & Water of Crystallisation", importance: "high", isCompleted: false },
    ],
    keyFormulas: [
      "Baking Soda: NaHCO₃ (Sodium Hydrogen Carbonate)",
      "Washing Soda: Na₂CO₃·10H₂O",
      "Bleaching Powder: CaOCl₂",
      "Plaster of Paris: CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O (Gypsum)",
    ],
    keyDefinitions: [
      { term: "Neutralisation", definition: "The reaction between an acid and a base to form salt and water: Acid + Base → Salt + Water." },
      { term: "Water of Crystallisation", definition: "The fixed number of water molecules present in one formula unit of a salt (e.g. CuSO₄·5H₂O)." },
      { term: "pH Scale", definition: "A scale measuring hydrogen ion concentration: pH = -log[H⁺]. pH < 7 is acidic, pH = 7 is neutral, pH > 7 is basic." }
    ],
    summary: "Acids produce H⁺ ions in aqueous solution, taste sour, and turn blue litmus red. Bases produce OH⁻ ions, taste bitter, feel soapy, and turn red litmus blue. Salts are formed from neutralization reactions. Compounds like Bleaching Powder, Baking Soda, Washing Soda, and POP have critical industrial and household uses."
  },
  {
    id: "ch-sci10-09",
    subjectId: "cbse-10-sci",
    number: 9,
    title: "Light — Reflection and Refraction",
    description: "Spherical mirrors, mirror formula, magnification, refraction through glass slab, Snell's law, spherical lenses, lens formula, and power of a lens.",
    marksWeightage: 10,
    estimatedHours: 6,
    topics: [
      { id: "top-sci10-09-1", chapterId: "ch-sci10-09", title: "Reflection by Spherical Mirrors & Ray Diagrams", importance: "high", isCompleted: true },
      { id: "top-sci10-09-2", chapterId: "ch-sci10-09", title: "Mirror Formula and Magnification Numericals", importance: "high", isCompleted: true },
      { id: "top-sci10-09-3", chapterId: "ch-sci10-09", title: "Refraction & Snell's Law", importance: "high", isCompleted: false },
      { id: "top-sci10-09-4", chapterId: "ch-sci10-09", title: "Lens Formula, Magnification, and Power of Lens", importance: "high", isCompleted: false },
    ],
    keyFormulas: [
      "Mirror Formula: 1/f = 1/v + 1/u",
      "Mirror Magnification: m = -v/u = h'/h",
      "Snell's Law: n₂₁ = sin(i) / sin(r) = v₁ / v₂",
      "Lens Formula: 1/f = 1/v - 1/u",
      "Lens Magnification: m = v/u = h'/h",
      "Power of Lens: P = 1 / f (in metres) [Unit: Dioptre (D)]",
    ],
    keyDefinitions: [
      { term: "Principal Focus", definition: "The point on the principal axis where rays incident parallel to the principal axis converge or appear to diverge from after reflection/refraction." },
      { term: "Snell's Law of Refraction", definition: "The ratio of sine of angle of incidence to sine of angle of refraction is constant for light of a given color and for a given pair of media." },
      { term: "1 Dioptre (1 D)", definition: "The power of a lens of focal length 1 metre: 1 D = 1 m⁻¹." }
    ],
    mnemonics: [
      {
        title: "Sign Convention for Mirrors & Lenses",
        trick: "Object distance (u) is ALWAYS NEGATIVE",
        explanation: "Light travels left-to-right. Real images have negative v in mirrors, positive v in lenses. Concave focal length is negative; convex focal length is positive."
      }
    ],
    summary: "Light travels in straight lines and exhibits reflection and refraction. Concave mirrors converge light while convex mirrors diverge light and provide wide field of view in rearview mirrors. Concave lenses form virtual erect diminished images; convex lenses can form real or virtual images depending on object position."
  },
  {
    id: "ch-sci10-11",
    subjectId: "cbse-10-sci",
    number: 11,
    title: "Electricity",
    description: "Electric current, potential difference, Ohm's law, resistance, factors affecting resistance, series and parallel circuits, Joule's heating effect, electric power.",
    marksWeightage: 9,
    estimatedHours: 5,
    topics: [
      { id: "top-sci10-11-1", chapterId: "ch-sci10-11", title: "Electric Current & Potential Difference (V = W/Q)", importance: "high", isCompleted: true },
      { id: "top-sci10-11-2", chapterId: "ch-sci10-11", title: "Ohm's Law and Resistivity (R = ρl/A)", importance: "high", isCompleted: false },
      { id: "top-sci10-11-3", chapterId: "ch-sci10-11", title: "Resistors in Series and Parallel Combinations", importance: "high", isCompleted: false },
      { id: "top-sci10-11-4", chapterId: "ch-sci10-11", title: "Joule's Heating Effect & Electric Power (P = VI = I²R = V²/R)", importance: "high", isCompleted: false },
    ],
    keyFormulas: [
      "Electric Current: I = Q / t = ne / t",
      "Potential Difference: V = W / Q",
      "Ohm's Law: V = I × R",
      "Resistance: R = ρ × (l / A)",
      "Series Equivalent: R_s = R₁ + R₂ + R₃",
      "Parallel Equivalent: 1/R_p = 1/R₁ + 1/R₂ + 1/R₃",
      "Joule's Law of Heating: H = I²Rt",
      "Electric Power: P = V × I = I²R = V² / R",
      "Commercial Unit of Energy: 1 kWh = 3.6 × 10⁶ Joules (1 Unit)",
    ],
    keyDefinitions: [
      { term: "1 Ampere", definition: "The flow of electric charge across a cross section at the rate of one coulomb per second (1 A = 1 C/s)." },
      { term: "1 Volt", definition: "The potential difference between two points when 1 joule of work is done to move a charge of 1 coulomb from one point to the other (1 V = 1 J/C)." },
      { term: "Resistivity (ρ)", definition: "The resistance of a conductor of unit length and unit cross-sectional area, characteristic of the material (Unit: Ω·m)." }
    ],
    summary: "Electricity flows due to drift of electrons. Ohm's law states V ∝ I at constant temperature. In series circuits, current remains constant while voltage divides. In parallel circuits, voltage is constant while current divides. Domestic circuits are wired in parallel to ensure independent appliance operation."
  },

  // Class 12 Physics (CBSE)
  {
    id: "ch-phy12-01",
    subjectId: "cbse-12-phy",
    number: 1,
    title: "Electric Charges and Fields",
    description: "Coulomb's law, forces between multiple charges, electric field, electric field lines, electric dipole, torque on a dipole, Gauss's law and its applications.",
    marksWeightage: 9,
    estimatedHours: 6,
    topics: [
      { id: "top-phy12-01-1", chapterId: "ch-phy12-01", title: "Coulomb's Law & Vector Form", importance: "high", isCompleted: true },
      { id: "top-phy12-01-2", chapterId: "ch-phy12-01", title: "Electric Field due to an Electric Dipole (Axial & Equatorial)", importance: "high", isCompleted: true },
      { id: "top-phy12-01-3", chapterId: "ch-phy12-01", title: "Electric Flux & Gauss's Law Statement", importance: "high", isCompleted: false },
      { id: "top-phy12-01-4", chapterId: "ch-phy12-01", title: "Gauss Law Applications (Infinite Wire, Plane Sheet, Spherical Shell)", importance: "high", isCompleted: false },
    ],
    keyFormulas: [
      "Coulomb's Law: F = (1 / 4πε₀) × (|q₁q₂| / r²)",
      "Electric Field: E = F / q₀ = (1 / 4πε₀) × (q / r²)",
      "Dipole Moment: p = q × 2a",
      "Dipole Field (Axial): E_axial = (1 / 4πε₀) × (2pr / (r² - a²)²) ≈ (2p / 4πε₀r³)",
      "Dipole Field (Equatorial): E_eq = (1 / 4πε₀) × (p / (r² + a²)^(3/2)) ≈ (p / 4πε₀r³)",
      "Torque on Dipole: τ = p × E = pE sin(θ)",
      "Gauss's Law: Φ = ∮ E · dA = q_enclosed / ε₀",
      "Field due to Infinite Straight Wire: E = λ / (2πε₀r)",
      "Field due to Infinite Plane Sheet: E = σ / (2ε₀)",
    ],
    keyDefinitions: [
      { term: "Quantization of Charge", definition: "Electric charge exists in discrete packets as integral multiples of elementary charge e: q = ±ne." },
      { term: "Gauss's Law", definition: "The total electric flux through a closed Gaussian surface is equal to 1/ε₀ times the net charge enclosed by the surface." },
      { term: "Electric Dipole", definition: "A pair of equal and opposite charges ±q separated by a small distance 2a." }
    ],
    summary: "Electrostatics deals with charges at rest. Electric fields represent force per unit positive test charge. Gauss's Law provides a powerful tool for calculating symmetric electric fields. Inside a charged conducting spherical shell, electric field is always zero."
  },
  {
    id: "ch-phy12-03",
    subjectId: "cbse-12-phy",
    number: 3,
    title: "Current Electricity",
    description: "Electric current, drift velocity, mobility, Ohm's law, V-I characteristics, electrical energy and power, Kirchhoff's laws and Wheatstone bridge.",
    marksWeightage: 8,
    estimatedHours: 5,
    topics: [
      { id: "top-phy12-03-1", chapterId: "ch-phy12-03", title: "Drift Velocity & Relation with Current (I = n e A v_d)", importance: "high", isCompleted: true },
      { id: "top-phy12-03-2", chapterId: "ch-phy12-03", title: "Temperature Dependence of Resistivity & Color Code", importance: "medium", isCompleted: false },
      { id: "top-phy12-03-3", chapterId: "ch-phy12-03", title: "EMF, Internal Resistance and Terminal Voltage", importance: "high", isCompleted: false },
      { id: "top-phy12-03-4", chapterId: "ch-phy12-03", title: "Kirchhoff's Rules (KCL & KVL) and Wheatstone Bridge Condition", importance: "high", isCompleted: false },
    ],
    keyFormulas: [
      "Drift Velocity: v_d = (eE / m) × τ = (eV / mL) × τ",
      "Current & Drift Velocity: I = n · e · A · v_d",
      "Resistivity: ρ = m / (n e² τ)",
      "Terminal Voltage: V = E - Ir (discharging) or V = E + Ir (charging)",
      "Kirchhoff's Junction Rule (KCL): Σ I_in = Σ I_out (Conservation of Charge)",
      "Kirchhoff's Loop Rule (KVL): Σ ΔV = 0 (Conservation of Energy)",
      "Wheatstone Bridge Balance: P / Q = R / S (when galvanometer current I_g = 0)",
    ],
    keyDefinitions: [
      { term: "Drift Velocity (v_d)", definition: "The average velocity with which free electrons get drifted towards the positive terminal under the influence of an external electric field." },
      { term: "Internal Resistance (r)", definition: "The opposition offered by the electrolyte and electrodes of a cell to the flow of electric current through it." },
      { term: "Electromotive Force (EMF)", definition: "The maximum potential difference between two electrodes of a cell when no current is drawn from it." }
    ],
    summary: "Free electrons in conductors drift with average velocity v_d ~ 10⁻⁴ m/s. Kirchhoff's Current Law embodies charge conservation, while Kirchhoff's Voltage Law embodies energy conservation. The Wheatstone bridge gives an accurate null-deflection method to determine unknown resistances."
  },

  // Class 10 Math (CBSE)
  {
    id: "ch-mat10-01",
    subjectId: "cbse-10-math",
    number: 1,
    title: "Real Numbers",
    description: "Fundamental Theorem of Arithmetic, proving irrationality of √2, √3, √5, decimal expansions, and LCM/HCF relations.",
    marksWeightage: 6,
    estimatedHours: 3,
    topics: [
      { id: "top-mat10-01-1", chapterId: "ch-mat10-01", title: "Fundamental Theorem of Arithmetic (Prime Factorisation)", importance: "high", isCompleted: true },
      { id: "top-mat10-01-2", chapterId: "ch-mat10-01", title: "HCF × LCM = Product of Two Numbers", importance: "high", isCompleted: true },
      { id: "top-mat10-01-3", chapterId: "ch-mat10-01", title: "Proving Irrationality of √p and (a + b√p)", importance: "high", isCompleted: false },
    ],
    keyFormulas: [
      "HCF(a, b) × LCM(a, b) = a × b",
      "Fundamental Theorem of Arithmetic: Every composite number can be uniquely expressed as a product of primes, except for order.",
    ],
    keyDefinitions: [
      { term: "Fundamental Theorem of Arithmetic", definition: "Every composite number can be factored uniquely as a product of prime powers." },
      { term: "Irrational Number", definition: "A real number that cannot be written in the form p/q (where p, q are integers and q ≠ 0) and has a non-terminating, non-repeating decimal expansion." }
    ],
    summary: "Real numbers comprise rational and irrational numbers. The fundamental theorem of arithmetic guarantees unique prime factorisation. Proof by contradiction is used to demonstrate irrationality of square roots of prime numbers."
  },
  {
    id: "ch-mat10-08",
    subjectId: "cbse-10-math",
    number: 8,
    title: "Introduction to Trigonometry",
    description: "Trigonometric ratios of acute angles, trigonometric ratios of specific angles (0°, 30°, 45°, 60°, 90°), and Pythagorean trigonometric identities.",
    marksWeightage: 8,
    estimatedHours: 5,
    topics: [
      { id: "top-mat10-08-1", chapterId: "ch-mat10-08", title: "Trigonometric Ratios (sin, cos, tan, cot, sec, cosec)", importance: "high", isCompleted: true },
      { id: "top-mat10-08-2", chapterId: "ch-mat10-08", title: "Values of Trigonometric Ratios for Standard Angles", importance: "high", isCompleted: true },
      { id: "top-mat10-08-3", chapterId: "ch-mat10-08", title: "Trigonometric Identities (sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ)", importance: "high", isCompleted: false },
    ],
    keyFormulas: [
      "sin θ = Opposite / Hypotenuse (P / H)",
      "cos θ = Adjacent / Hypotenuse (B / H)",
      "tan θ = Opposite / Adjacent (P / B) = sin θ / cos θ",
      "sin² θ + cos² θ = 1",
      "1 + tan² θ = sec² θ",
      "1 + cot² θ = cosec² θ",
      "Table: sin(30°)=1/2, sin(45°)=1/√2, sin(60°)=√3/2, cos(30°)=√3/2, cos(60°)=1/2, tan(45°)=1",
    ],
    mnemonics: [
      {
        title: "Pandit Badri Prasad / SOH CAH TOA",
        trick: "PBP / HHB -> S C T (Pandit Badri Prasad / Har Har Bole)",
        explanation: "P/H = Sine, B/H = Cosine, P/B = Tangent."
      }
    ],
    summary: "Trigonometry studies the relationships between side lengths and angles of triangles. The core identities sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ, and 1 + cot²θ = cosec²θ form the bedrock of geometric and analytical problem solving."
  },
];

export const QUESTION_PAPERS: QuestionPaper[] = [
  // 1. CBSE Class 10 Science 2025 (Verified Official Board Paper)
  {
    id: "pyq-cbse10-sci-2025",
    title: "CBSE Class 10 Science Main Board Exam (Set 31/1/1)",
    boardId: "cbse",
    classLevel: 10,
    subjectId: "cbse-10-sci",
    year: 2025,
    paperType: "official_board",
    setNumber: "Set 1 (Code 31/1/1)",
    totalMarks: 80,
    durationMinutes: 180,
    isVerifiedOfficial: true,
    verifiedBy: "CBSE Academic Verification Unit",
    downloadCount: 14200,
    tags: ["Official", "Complete Solutions", "2025 Board Exam", "Marking Scheme Included"],
    yearAvailable: true,
    sections: [
      {
        name: "Section A",
        title: "Multiple Choice Questions (20 Qs × 1 Mark)",
        totalQuestions: 20,
        marksPerQuestion: 1,
        description: "Objective MCQs and Assertion-Reason questions. All questions are compulsory.",
        questions: [
          {
            id: "q-sci10-25-01",
            questionNumber: 1,
            subjectId: "cbse-10-sci",
            type: "mcq",
            text: "When aqueous solutions of potassium iodide and lead nitrate are mixed, a precipitate is formed. What is the color of the precipitate and the compound formed?",
            options: [
              { id: "a", label: "A", text: "White, Potassium nitrate" },
              { id: "b", label: "B", text: "Yellow, Lead iodide (PbI₂)", isCorrect: true },
              { id: "c", label: "C", text: "Black, Lead oxide" },
              { id: "d", label: "D", text: "Yellow, Lead nitrate" },
            ],
            correctAnswer: "b",
            marks: 1,
            explanation: "2KI(aq) + Pb(NO₃)₂(aq) → PbI₂(s)↓ (Yellow precipitate) + 2KNO₃(aq). Lead iodide is a bright yellow insoluble precipitate.",
            difficulty: "easy",
            hint: "Recall the standard double displacement demonstration in Chapter 1 with lead salts.",
          },
          {
            id: "q-sci10-25-02",
            questionNumber: 2,
            subjectId: "cbse-10-sci",
            type: "mcq",
            text: "An electric bulb is rated 220 V and 100 W. When it is operated on 110 V, the power consumed will be:",
            options: [
              { id: "a", label: "A", text: "100 W" },
              { id: "b", label: "B", text: "75 W" },
              { id: "c", label: "C", text: "50 W" },
              { id: "d", label: "D", text: "25 W", isCorrect: true },
            ],
            correctAnswer: "d",
            marks: 1,
            explanation: "Resistance of bulb is constant: R = V² / P = (220)² / 100 = 484 Ω. At 110 V, P' = V'² / R = (110)² / 484 = 12100 / 484 = 25 W.",
            difficulty: "medium",
            hint: "Calculate the internal filament resistance R first, which does not change with applied voltage.",
          },
          {
            id: "q-sci10-25-03",
            questionNumber: 3,
            subjectId: "cbse-10-sci",
            type: "mcq",
            text: "Which of the following mirror is used by dentists to observe large images of teeth?",
            options: [
              { id: "a", label: "A", text: "Convex mirror" },
              { id: "b", label: "B", text: "Plane mirror" },
              { id: "c", label: "C", text: "Concave mirror", isCorrect: true },
              { id: "d", label: "D", text: "Cylindrical mirror" },
            ],
            correctAnswer: "c",
            marks: 1,
            explanation: "When an object is placed between the pole (P) and principal focus (F) of a concave mirror, it produces an erect, magnified, and virtual image.",
            difficulty: "easy",
          },
        ]
      },
      {
        name: "Section B",
        title: "Short Answer Type-I (6 Qs × 2 Marks)",
        totalQuestions: 6,
        marksPerQuestion: 2,
        description: "Concise answers with chemical equations / ray diagrams.",
        questions: [
          {
            id: "q-sci10-25-07",
            questionNumber: 21,
            subjectId: "cbse-10-sci",
            type: "short_answer",
            text: "State Snell's law of refraction. A ray of light travelling in air enters obliquely into water. Does the light ray bend towards the normal or away from the normal? Why?",
            marks: 2,
            correctAnswer: "1. The ratio of sin(i) to sin(r) is constant (n = sin i / sin r). 2. Bends TOWARDS normal because water is optically denser than air (speed of light decreases in water).",
            explanation: "According to Snell's law: n = sin(i)/sin(r). When light passes from an optically rarer medium (air) to an optically denser medium (water), its velocity decreases, causing the refracted ray to bend towards the normal.",
            difficulty: "medium",
            rubricCriteria: [
              { criteria: "Correct statement of Snell's Law with formula", marks: 1 },
              { criteria: "Correct direction (towards normal) with optical density reasoning", marks: 1 },
            ]
          }
        ]
      }
    ]
  },

  // 2. CBSE Class 10 Mathematics 2024 (Verified Official Board Paper)
  {
    id: "pyq-cbse10-mat-2024",
    title: "CBSE Class 10 Mathematics Standard Official Board Paper (Set 30/2/1)",
    boardId: "cbse",
    classLevel: 10,
    subjectId: "cbse-10-math",
    year: 2024,
    paperType: "official_board",
    setNumber: "Set 1 (Code 30/2/1)",
    totalMarks: 80,
    durationMinutes: 180,
    isVerifiedOfficial: true,
    verifiedBy: "CBSE Exam Controller",
    downloadCount: 18900,
    tags: ["Official", "Standard Math", "Step-by-Step Marking", "2024 Annual"],
    yearAvailable: true,
    sections: [
      {
        name: "Section A",
        title: "Section A: 20 Multiple Choice Questions (1 Mark Each)",
        totalQuestions: 20,
        marksPerQuestion: 1,
        description: "Objective MCQs including 2 assertion-reason questions.",
        questions: [
          {
            id: "q-mat10-24-01",
            questionNumber: 1,
            subjectId: "cbse-10-math",
            type: "mcq",
            text: "If two positive integers a and b are written as a = x³y² and b = xy³, where x, y are prime numbers, then HCF(a, b) is:",
            options: [
              { id: "a", label: "A", text: "xy" },
              { id: "b", label: "B", text: "xy²", isCorrect: true },
              { id: "c", label: "C", text: "x³y³" },
              { id: "d", label: "D", text: "x²y²" },
            ],
            correctAnswer: "b",
            marks: 1,
            explanation: "HCF is the product of the smallest power of each common prime factor. Common prime factors are x (smallest power 1) and y (smallest power 2). Hence HCF = x¹y² = xy².",
            difficulty: "easy",
          },
          {
            id: "q-mat10-24-02",
            questionNumber: 2,
            subjectId: "cbse-10-math",
            type: "mcq",
            text: "If sin θ + cos θ = √2 cos θ, then the value of tan θ is:",
            options: [
              { id: "a", label: "A", text: "√2 - 1", isCorrect: true },
              { id: "b", label: "B", text: "√2 + 1" },
              { id: "c", label: "C", text: "1 / √2" },
              { id: "d", label: "D", text: "√3" },
            ],
            correctAnswer: "a",
            marks: 1,
            explanation: "Given sin θ + cos θ = √2 cos θ. Dividing both sides by cos θ gives: (sin θ / cos θ) + 1 = √2  =>  tan θ + 1 = √2  =>  tan θ = √2 - 1.",
            difficulty: "medium",
          }
        ]
      }
    ]
  },

  // 3. CBSE Class 12 Physics 2025 (Official Board Paper)
  {
    id: "pyq-cbse12-phy-2025",
    title: "CBSE Class 12 Physics Main Board Exam (Code 55/1/1)",
    boardId: "cbse",
    classLevel: 12,
    subjectId: "cbse-12-phy",
    year: 2025,
    paperType: "official_board",
    setNumber: "Set 1 (Code 55/1/1)",
    totalMarks: 70,
    durationMinutes: 180,
    isVerifiedOfficial: true,
    verifiedBy: "CBSE Board Examination Directorate",
    downloadCount: 22100,
    tags: ["Official", "Class 12 Physics", "Competency Questions", "2025 Verified"],
    yearAvailable: true,
    sections: [
      {
        name: "Section A",
        title: "Section A: Objective Questions (16 Qs × 1 Mark)",
        totalQuestions: 16,
        marksPerQuestion: 1,
        description: "12 MCQs and 4 Assertion-Reason questions.",
        questions: [
          {
            id: "q-phy12-25-01",
            questionNumber: 1,
            subjectId: "cbse-12-phy",
            type: "mcq",
            text: "Two point charges +8q and -2q are located at x = 0 and x = L respectively. The location of a point on the x-axis at which the net electric field due to these two charges is zero is:",
            options: [
              { id: "a", label: "A", text: "x = 8L" },
              { id: "b", label: "B", text: "x = 4L" },
              { id: "c", label: "C", text: "x = 2L", isCorrect: true },
              { id: "d", label: "D", text: "x = L / 4" },
            ],
            correctAnswer: "c",
            marks: 1,
            explanation: "For opposite charges of unequal magnitude, the null point lies outside the charges closer to the smaller charge (-2q). Let point be x > L: kq(8)/x² = kq(2)/(x - L)² => 4/x² = 1/(x-L)² => 2/x = 1/(x-L) => 2x - 2L = x => x = 2L.",
            difficulty: "medium",
          }
        ]
      }
    ]
  },

  // 4. ICSE Class 10 Physics 2024
  {
    id: "pyq-icse10-phy-2024",
    title: "ICSE Class 10 Physics Board Paper 2024",
    boardId: "icse",
    classLevel: 10,
    subjectId: "icse-10-phy",
    year: 2024,
    paperType: "official_board",
    setNumber: "Paper 1 (Science)",
    totalMarks: 80,
    durationMinutes: 120,
    isVerifiedOfficial: true,
    verifiedBy: "CISCE Verification Unit",
    downloadCount: 9400,
    tags: ["Official ICSE", "Section I & II", "Full Solutions"],
    yearAvailable: true,
    sections: [
      {
        name: "Section I",
        title: "Compulsory Short Questions (40 Marks)",
        totalQuestions: 15,
        marksPerQuestion: 2,
        description: "All questions in Section I are compulsory.",
        questions: [
          {
            id: "q-icse-phy-01",
            questionNumber: 1,
            subjectId: "icse-10-phy",
            type: "mcq",
            text: "The SI unit of torque or moment of force is:",
            options: [
              { id: "a", label: "A", text: "Newton / metre (N/m)" },
              { id: "b", label: "B", text: "Newton metre (N·m)", isCorrect: true },
              { id: "c", label: "C", text: "Joule / second (J/s)" },
              { id: "d", label: "D", text: "Dyne / cm" },
            ],
            correctAnswer: "b",
            marks: 1,
            explanation: "Torque = Force × Perpendicular distance = N × m = N·m.",
            difficulty: "easy"
          }
        ]
      }
    ]
  },

  // 5. PSEB Class 10 Science 2024
  {
    id: "pyq-pseb10-sci-2024",
    title: "PSEB Class 10 Science (ਵਿਗਿਆਨ) Annual Board Paper 2024",
    boardId: "pseb",
    classLevel: 10,
    subjectId: "pseb-10-sci",
    year: 2024,
    paperType: "official_board",
    setNumber: "Series A",
    totalMarks: 80,
    durationMinutes: 180,
    isVerifiedOfficial: true,
    verifiedBy: "PSEB Examination Wing",
    downloadCount: 8100,
    tags: ["Official PSEB", "Bilingual", "Punjab State Board"],
    yearAvailable: true,
    sections: [
      {
        name: "Part A (ਭਾਗ-ੳ)",
        title: "Part A: Objective & MCQs (25 Marks)",
        totalQuestions: 10,
        marksPerQuestion: 1,
        description: "Multiple choice and one-word questions.",
        questions: [
          {
            id: "q-pseb-sci-01",
            questionNumber: 1,
            subjectId: "pseb-10-sci",
            type: "mcq",
            text: "ਲੋਹੇ ਨੂੰ ਜੰਗਾਲ ਲੱਗਣ ਤੋਂ ਬਚਾਉਣ ਲਈ ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਤਰੀਕਾ ਸਭ ਤੋਂ ਢੁੱਕਵਾਂ ਹੈ? (Which method is suitable for preventing an iron vessel from rusting?)",
            options: [
              { id: "a", label: "A", text: "ਗਰੀਸ ਲਗਾਉਣਾ (Applying grease)" },
              { id: "b", label: "B", text: "ਪੇਂਟ ਲਗਾਉਣਾ (Applying paint)" },
              { id: "c", label: "C", text: "ਜਿਸਤ (ਜਿੰਕ) ਦੀ ਪਰਤ ਚੜ੍ਹਾਉਣਾ (Applying a coating of zinc)", isCorrect: true },
              { id: "d", label: "D", text: "ਉਪਰੋਕਤ ਸਾਰੇ (All of the above)" },
            ],
            correctAnswer: "c",
            marks: 1,
            explanation: "Galvanisation (applying a coating of zinc) is the most durable method for preventing iron from rusting without affecting heating properties.",
            difficulty: "easy"
          }
        ]
      }
    ]
  },

  // Additional Years (2023, 2022, 2021, 2020, 2019, 2018)
  {
    id: "pyq-cbse10-sci-2023",
    title: "CBSE Class 10 Science Main Examination 2023",
    boardId: "cbse",
    classLevel: 10,
    subjectId: "cbse-10-sci",
    year: 2023,
    paperType: "official_board",
    setNumber: "Set 2 (Code 31/2/2)",
    totalMarks: 80,
    durationMinutes: 180,
    isVerifiedOfficial: true,
    verifiedBy: "CBSE Official Archive",
    downloadCount: 16500,
    tags: ["Official", "2023 Board", "Verified Solutions"],
    yearAvailable: true,
    sections: []
  },
  {
    id: "pyq-cbse10-sci-2022",
    title: "CBSE Class 10 Science Term-2 Board Examination 2022",
    boardId: "cbse",
    classLevel: 10,
    subjectId: "cbse-10-sci",
    year: 2022,
    paperType: "official_board",
    setNumber: "Term-2 Set 1",
    totalMarks: 40,
    durationMinutes: 120,
    isVerifiedOfficial: true,
    verifiedBy: "CBSE Official Archive",
    downloadCount: 11200,
    tags: ["Official", "Term 2 Pattern", "Subjective"],
    yearAvailable: true,
    sections: []
  },
  {
    id: "pyq-cbse10-sci-2021",
    title: "CBSE Class 10 Science Official Sample & Assessment Paper 2021",
    boardId: "cbse",
    classLevel: 10,
    subjectId: "cbse-10-sci",
    year: 2021,
    paperType: "sample_paper",
    setNumber: "Official Sample Set",
    totalMarks: 80,
    durationMinutes: 180,
    isVerifiedOfficial: true,
    verifiedBy: "CBSE Academic Branch",
    downloadCount: 9800,
    tags: ["Official Sample", "COVID Assessment Pattern"],
    yearAvailable: true,
    sections: []
  },
  {
    id: "pyq-cbse10-sci-2020",
    title: "CBSE Class 10 Science Board Paper 2020",
    boardId: "cbse",
    classLevel: 10,
    subjectId: "cbse-10-sci",
    year: 2020,
    paperType: "official_board",
    setNumber: "Set 1 (Code 31/4/1)",
    totalMarks: 80,
    durationMinutes: 180,
    isVerifiedOfficial: true,
    verifiedBy: "CBSE Archives",
    downloadCount: 15400,
    tags: ["Official", "Pre-COVID Standard Blueprint"],
    yearAvailable: true,
    sections: []
  },
  {
    id: "pyq-cbse10-sci-2019",
    title: "CBSE Class 10 Science Board Paper 2019",
    boardId: "cbse",
    classLevel: 10,
    subjectId: "cbse-10-sci",
    year: 2019,
    paperType: "official_board",
    setNumber: "Set 3 (Code 31/1/3)",
    totalMarks: 80,
    durationMinutes: 180,
    isVerifiedOfficial: true,
    verifiedBy: "CBSE Archives",
    downloadCount: 13900,
    tags: ["Official", "Historical Archive"],
    yearAvailable: true,
    sections: []
  },
  {
    id: "pyq-cbse10-sci-2018",
    title: "CBSE Class 10 Science Board Paper 2018",
    boardId: "cbse",
    classLevel: 10,
    subjectId: "cbse-10-sci",
    year: 2018,
    paperType: "official_board",
    setNumber: "Set 1",
    totalMarks: 80,
    durationMinutes: 180,
    isVerifiedOfficial: true,
    verifiedBy: "CBSE Archives",
    downloadCount: 12100,
    tags: ["Official", "10-Year Series Benchmark"],
    yearAvailable: true,
    sections: []
  },
];

export const MOCK_EXAMS: MockExam[] = [
  {
    id: "mock-cbse10-sci-full",
    title: "CBSE Class 10 Science All-India Grand Mock Test 2026",
    subjectId: "cbse-10-sci",
    boardId: "cbse",
    classLevel: 10,
    durationMinutes: 45, // Demo test duration
    totalMarks: 35,
    isFullLength: true,
    questionCount: 10,
    description: "Full syllabus simulation designed according to the latest CBSE 2026 competency-based blueprint.",
    instructions: [
      "The exam consists of 10 questions covering Physics, Chemistry, and Biology.",
      "All questions are compulsory with immediate automated & AI rubric evaluation.",
      "Countdown timer will automatically submit your test once time expires.",
      "Use the question palette on the right to jump between questions or mark for review."
    ],
    questions: [
      {
        id: "mock-q1",
        questionNumber: 1,
        subjectId: "cbse-10-sci",
        type: "mcq",
        text: "Which of the following compounds is responsible for the yellow color of turmeric turning reddish-brown when washed with soap?",
        options: [
          { id: "a", label: "A", text: "Soap is acidic in nature" },
          { id: "b", label: "B", text: "Soap is basic in nature and turmeric is an acid-base indicator", isCorrect: true },
          { id: "c", label: "C", text: "Turmeric acts as a reducing agent on fatty acids" },
          { id: "d", label: "D", text: "Soap oxidizes curcumin to form an aldehyde" },
        ],
        correctAnswer: "b",
        marks: 1,
        explanation: "Turmeric contains curcumin which is a natural indicator. In basic medium (like soap, which is sodium/potassium salt of fatty acids), it turns reddish-brown. When rinsed with water (neutral), it returns to yellow.",
        difficulty: "easy",
      },
      {
        id: "mock-q2",
        questionNumber: 2,
        subjectId: "cbse-10-sci",
        type: "mcq",
        text: "A student performs an experiment with a convex lens and finds that a real and inverted image of the same size as the object is formed. The object was placed:",
        options: [
          { id: "a", label: "A", text: "At Focus F₁" },
          { id: "b", label: "B", text: "Between F₁ and Optical Centre O" },
          { id: "c", label: "C", text: "At 2F₁ (Centre of curvature)", isCorrect: true },
          { id: "d", label: "D", text: "At infinity" },
        ],
        correctAnswer: "c",
        marks: 1,
        explanation: "When an object is placed at 2F₁ of a convex lens, its real, inverted image of the exact same size is formed at 2F₂ on the other side.",
        difficulty: "easy",
      },
      {
        id: "mock-q3",
        questionNumber: 3,
        subjectId: "cbse-10-sci",
        type: "mcq",
        text: "What happens when dilute Hydrochloric acid (HCl) is added to Iron filings?",
        options: [
          { id: "a", label: "A", text: "Hydrogen gas and Iron (II) chloride are produced", isCorrect: true },
          { id: "b", label: "B", text: "Chlorine gas and Iron hydroxide are produced" },
          { id: "c", label: "C", text: "No reaction takes place because iron is unreactive" },
          { id: "d", label: "D", text: "Iron salt and water only are produced" },
        ],
        correctAnswer: "a",
        marks: 1,
        explanation: "Fe(s) + 2HCl(aq) → FeCl₂(aq) + H₂(g)↑. Iron displaces hydrogen from dilute acid as it is higher in the reactivity series than hydrogen.",
        difficulty: "medium",
      },
      {
        id: "mock-q4",
        questionNumber: 4,
        subjectId: "cbse-10-sci",
        type: "numerical",
        text: "A cylindrical copper conductor has length L and cross-sectional area A with resistance R = 12 Ω. If it is stretched uniformly to double its length (2L), what is its new resistance in Ohms (Ω)? (Enter only the number)",
        correctAnswer: "48",
        marks: 3,
        explanation: "When wire is stretched to double length (L' = 2L), volume remains constant: V = A · L = A' · L'  =>  A' = A/2. New resistance R' = ρ(L' / A') = ρ(2L / (A/2)) = 4 · ρ(L/A) = 4R = 4 × 12 = 48 Ω.",
        difficulty: "hard",
        hint: "Remember that stretching a wire decreases its cross-sectional area while keeping volume constant.",
      },
      {
        id: "mock-q5",
        questionNumber: 5,
        subjectId: "cbse-10-sci",
        type: "mcq",
        text: "The correct sequence of anaerobic respiration in Yeast cells is:",
        options: [
          { id: "a", label: "A", text: "Glucose → Pyruvate → Ethanol + Carbon dioxide + Energy", isCorrect: true },
          { id: "b", label: "B", text: "Glucose → Pyruvate → Lactic acid + Energy" },
          { id: "c", label: "C", text: "Glucose → Pyruvate → Carbon dioxide + Water + Energy" },
          { id: "d", label: "D", text: "Glucose → Ethanol + Water" },
        ],
        correctAnswer: "a",
        marks: 1,
        explanation: "In yeast (fermentation), glycolysis converts 6-carbon glucose into 3-carbon pyruvate in cytoplasm. In the absence of oxygen, pyruvate is converted into ethanol, CO₂ and 2 ATP molecules.",
        difficulty: "medium",
      },
      {
        id: "mock-q6",
        questionNumber: 6,
        subjectId: "cbse-10-sci",
        type: "short_answer",
        text: "Why is Plaster of Paris (POP) stored in a moisture-proof container? Write the balanced chemical equation for the reaction that occurs when it absorbs water.",
        correctAnswer: "POP absorbs atmospheric moisture and sets into a hard solid mass called Gypsum (CaSO₄·2H₂O), losing its setting properties. Equation: CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O.",
        marks: 3,
        explanation: "POP (Calcium sulphate hemihydrate) readily hydrates with moisture to form hard gypsum. Therefore, it must be stored in airtight moisture-proof bags.",
        difficulty: "medium",
        rubricCriteria: [
          { criteria: "Reasoning (hydration into hard solid Gypsum causing loss of setting power)", marks: 1.5 },
          { criteria: "Correct balanced chemical formula with water coefficients", marks: 1.5 }
        ]
      },
      {
        id: "mock-q7",
        questionNumber: 7,
        subjectId: "cbse-10-sci",
        type: "long_answer",
        text: "State Ohm's Law. Draw a circuit diagram showing the setup to verify Ohm's Law with a resistor, ammeter, voltmeter, rheostat, and cell. What is the nature of the V-I graph for an ohmic conductor?",
        correctAnswer: "Ohm's law states that electric current flowing through a conductor is directly proportional to potential difference across its ends at constant temperature (V = IR). Circuit includes ammeter in series, voltmeter in parallel with resistor R, rheostat, key and battery. V-I graph is a straight line passing through the origin whose slope represents resistance R.",
        marks: 5,
        explanation: "Ohm's law: V ∝ I (T = constant) => V = IR. The V-I graph is linear, with slope = ΔV / ΔI = R.",
        difficulty: "hard",
        rubricCriteria: [
          { criteria: "Clear statement of Ohm's Law with temperature condition", marks: 1.5 },
          { criteria: "Circuit component arrangement description (Ammeter in series, Voltmeter in parallel)", marks: 2.0 },
          { criteria: "Nature and significance of slope of V-I graph", marks: 1.5 }
        ]
      }
    ]
  },

  // Class 12 Physics Chapter Test
  {
    id: "mock-cbse12-phy-ch1",
    title: "Class 12 Physics: Electrostatics & Fields Chapter Test",
    subjectId: "cbse-12-phy",
    boardId: "cbse",
    classLevel: 12,
    durationMinutes: 30,
    totalMarks: 25,
    isFullLength: false,
    questionCount: 5,
    description: "Focused chapter diagnostic on Coulomb's Law, Dipoles, Electric Flux, and Gauss's Theorem applications.",
    instructions: [
      "Standard CBSE marking with step evaluation.",
      "Calculators are not permitted.",
    ],
    questions: [
      {
        id: "mock-phy12-q1",
        questionNumber: 1,
        subjectId: "cbse-12-phy",
        type: "mcq",
        text: "An electric dipole of moment p is placed in a uniform electric field E. The torque τ experienced by the dipole is maximum when the angle between p and E is:",
        options: [
          { id: "a", label: "A", text: "0° (parallel)" },
          { id: "b", label: "B", text: "90° (perpendicular)", isCorrect: true },
          { id: "c", label: "C", text: "180° (anti-parallel)" },
          { id: "d", label: "D", text: "45°" },
        ],
        correctAnswer: "b",
        marks: 1,
        explanation: "Torque τ = p × E = pE sin(θ). For maximum torque, sin(θ) = 1 => θ = 90°.",
        difficulty: "easy"
      },
      {
        id: "mock-phy12-q2",
        questionNumber: 2,
        subjectId: "cbse-12-phy",
        type: "mcq",
        text: "The electric flux through a Gaussian sphere of radius R enclosing charge Q is Φ. If the radius of the sphere is doubled to 2R, the electric flux will be:",
        options: [
          { id: "a", label: "A", text: "4 Φ" },
          { id: "b", label: "B", text: "2 Φ" },
          { id: "c", label: "C", text: "Φ (remains unchanged)", isCorrect: true },
          { id: "d", label: "D", text: "Φ / 4" },
        ],
        correctAnswer: "c",
        marks: 1,
        explanation: "According to Gauss's Law, total flux depends ONLY on the net enclosed charge: Φ = Q_enc / ε₀. It is independent of the size or radius of the Gaussian surface.",
        difficulty: "easy"
      }
    ]
  }
];

export const FLASHCARDS: Flashcard[] = [
  {
    id: "fc-1",
    chapterId: "ch-sci10-01",
    front: "What is the chemical formula and color of Rust?",
    back: "Hydrated Iron(III) Oxide: Fe₂O₃·xH₂O (Reddish-brown).",
    tip: "Formed when iron reacts with oxygen and water vapour.",
    tag: "Formula",
    easeFactor: 2.5,
    intervalDays: 3,
    status: "review"
  },
  {
    id: "fc-2",
    chapterId: "ch-sci10-01",
    front: "What gas is evolved during the electrolysis of water at the cathode and anode?",
    back: "Cathode (-): Hydrogen (H₂) [Double volume]. Anode (+): Oxygen (O₂).",
    tip: "Remember H₂:O₂ volume ratio is 2:1 because H₂O has 2 H per O.",
    tag: "Lab Practical",
    easeFactor: 2.6,
    intervalDays: 5,
    status: "mastered"
  },
  {
    id: "fc-3",
    chapterId: "ch-sci10-09",
    front: "What is the focal length of a plane mirror?",
    back: "Infinity (∞). Radius of curvature R = ∞, so f = ∞.",
    tip: "Power of a plane mirror is P = 1/f = 0 Dioptres.",
    tag: "Concept",
    easeFactor: 2.4,
    intervalDays: 1,
    status: "learning"
  },
  {
    id: "fc-4",
    chapterId: "ch-sci10-11",
    front: "What is 1 kiloWatt-hour (1 kWh) in Joules?",
    back: "1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ Joules (or 3.6 MJ).",
    tip: "This is the commercial unit of electricity (1 'Unit' on your electricity meter).",
    tag: "Numerical",
    easeFactor: 2.5,
    intervalDays: 4,
    status: "review"
  },
];

// ============================================
// STAGE 2 MOCK DATASETS
// ============================================
import { StudyTask, Achievement, UserSettings } from "@/types";

export const INITIAL_STUDY_TASKS: StudyTask[] = [
  {
    id: "task-1",
    title: "Optics Sign Convention & Mirror Numericals",
    subjectId: "cbse-10-sci",
    subjectName: "Science",
    chapterTitle: "Light — Reflection and Refraction",
    taskType: "practice_questions",
    estimatedMinutes: 35,
    isCompleted: false,
    scheduledDate: new Date().toISOString().split("T")[0],
    priority: "high",
    reasonRecommended: "Based on recent mock test diagnostic: focal length sign errors were detected.",
    actionUrl: "/tutor?prompt=Explain%20mirror%20and%20lens%20sign%20conventions%20with%20a%20numerical%20example",
  },
  {
    id: "task-2",
    title: "Balancing Redox Reactions & Rusting Prevention",
    subjectId: "cbse-10-sci",
    subjectName: "Science",
    chapterTitle: "Chemical Reactions and Equations",
    taskType: "revision_session",
    estimatedMinutes: 25,
    isCompleted: true,
    scheduledDate: new Date().toISOString().split("T")[0],
    priority: "medium",
    reasonRecommended: "Spaced revision trigger: 7 days since last chapter review.",
    actionUrl: "/notes/ch-sci10-01",
  },
  {
    id: "task-3",
    title: "Trigonometric Identities 3-Mark Derivations",
    subjectId: "cbse-10-math",
    subjectName: "Mathematics",
    chapterTitle: "Introduction to Trigonometry",
    taskType: "concept_learning",
    estimatedMinutes: 40,
    isCompleted: false,
    scheduledDate: new Date().toISOString().split("T")[0],
    priority: "high",
    reasonRecommended: "High weightage blueprint topic (8 marks in standard board exam).",
    actionUrl: "/tutor?prompt=Give%20me%20a%20step-by-step%20derivation%20for%201%2Btan%5E2(theta)%3Dsec%5E2(theta)",
  },
  {
    id: "task-4",
    title: "CBSE Class 10 Science 2025 PYQ Section A & B",
    subjectId: "cbse-10-sci",
    subjectName: "Science",
    chapterTitle: "Board Blueprint Drill",
    taskType: "pyq_drill",
    estimatedMinutes: 45,
    isCompleted: false,
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    priority: "high",
    reasonRecommended: "Weekly board question paper speed conditioning.",
    actionUrl: "/papers?paperId=pyq-cbse10-sci-2025",
  },
  {
    id: "task-5",
    title: "Class 10 Science Grand Mock Exam (Timed Simulation)",
    subjectId: "cbse-10-sci",
    subjectName: "Science",
    chapterTitle: "Full Syllabus",
    taskType: "mock_exam",
    estimatedMinutes: 45,
    isCompleted: false,
    scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    priority: "high",
    reasonRecommended: "Bi-weekly timed exam simulation to measure pacing and score accuracy.",
    actionUrl: "/exams/mock-cbse10-sci-full",
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    code: "FIRST_MOCK",
    title: "Orbit Pioneer",
    description: "Complete your first timed board-pattern mock examination.",
    category: "exam_mastery",
    iconName: "Award",
    trophyModel: "gold_medal",
    xpReward: 150,
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    progressPercentage: 100,
    criteriaRequirement: "Complete 1 full mock exam",
  },
  {
    id: "ach-2",
    code: "STREAK_7",
    title: "Cosmic Discipline",
    description: "Maintain a 7-day continuous active study streak.",
    category: "streak",
    iconName: "Flame",
    trophyModel: "flame",
    xpReward: 300,
    isUnlocked: true,
    unlockedAt: new Date().toISOString(),
    progressPercentage: 100,
    criteriaRequirement: "Study for 7 consecutive days",
  },
  {
    id: "ach-3",
    code: "TUTOR_EXPLORER",
    title: "Quantum Inquirer",
    description: "Ask the AI Personal Tutor 10 deep curriculum-grounded questions.",
    category: "tutor_explorer",
    iconName: "Bot",
    trophyModel: "atom",
    xpReward: 200,
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 86400000).toISOString(),
    progressPercentage: 100,
    criteriaRequirement: "Ask 10 questions in AI Tutor",
  },
  {
    id: "ach-4",
    code: "PERFECTIONIST_90",
    title: "Einstein Diamond",
    description: "Score 90% or higher on any full-length mock examination.",
    category: "perfectionist",
    iconName: "Sparkles",
    trophyModel: "crystal",
    xpReward: 500,
    isUnlocked: false,
    progressPercentage: 83,
    criteriaRequirement: "Score >= 90% on a grand mock exam",
  },
  {
    id: "ach-5",
    code: "PYQ_SCHOLAR",
    title: "Newton Prism Master",
    description: "Inspect and solve questions from 5 verified Previous-Year Question Papers.",
    category: "revision_champion",
    iconName: "BookOpen",
    trophyModel: "prism",
    xpReward: 250,
    isUnlocked: false,
    progressPercentage: 40,
    criteriaRequirement: "Review 5 verified question papers",
  }
];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  graphicIntensity: "full_3d",
  companionAvatar: "nebula_core",
  themeAccent: "cyan",
  voiceEnabled: false,
  soundEffectsEnabled: true,
  reducedMotion: false,
  dailyGoalHours: 2.5,
  gamificationVisible: true,
};

