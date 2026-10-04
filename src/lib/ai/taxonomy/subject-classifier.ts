// ==============================================================================
// EDUVERSE AI — HIGH-PRECISION SUBJECT CLASSIFIER (PHASE 19)
// Classifies academic queries into standardized subjects with confidence scoring
// ==============================================================================

import { EducationalSubject } from "@/types/education-hierarchy";

interface SubjectKeywordRule {
  subject: EducationalSubject;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  regexPatterns: RegExp[];
}

const SUBJECT_RULES: SubjectKeywordRule[] = [
  // 1. BIOLOGY
  {
    subject: "biology",
    primaryKeywords: [
      "photosynthesis", "chlorophyll", "stomata", "chloroplast", "nephron", "kidney",
      "heart", "ventricle", "atrium", "aorta", "circulation", "artery", "vein", "capillary",
      "mitochondria", "nucleus", "ribosome", "cell membrane", "cell wall", "cytoplasm",
      "digestion", "alimentary canal", "enzyme", "pepsin", "trypsin", "amylase", "bile",
      "respiration", "aerobic", "anaerobic", "atp", "alveoli", "lungs", "bronchi",
      "reproduction", "fertilization", "gamete", "zygote", "ovary", "testis", "dna",
      "heredity", "genetics", "mendel", "allele", "chromosome", "phenotype", "genotype",
      "evolution", "speciation", "homologous", "analogous", "fossil", "ecosystem",
      "trophic level", "food chain", "food web", "biodiversity", "neuron", "synapse",
      "reflex arc", "brain", "cerebrum", "cerebellum", "hormone", "endocrine", "insulin",
      "thyroxine", "adrenalin", "pituitary", "xylem", "phloem", "transpiration", "translocation"
    ],
    secondaryKeywords: ["organ", "tissue", "living", "plant", "animal", "human", "blood", "leaf", "root"],
    regexPatterns: [
      /\b(photo-?synthesis|circulat(ion|ory)|digest(ion|ive)|respirat(ion|ory)|reproduct(ion|ive))\b/i,
      /\b(dna|rna|gene(tic)?s?|chromosom(e|al)|mitos(is|ic)|meios(is|ic))\b/i,
      /\b(nephron|alveol(us|i)|stomat(a|al)|xylem|phloem)\b/i,
    ],
  },

  // 2. PHYSICS
  {
    subject: "physics",
    primaryKeywords: [
      "ohm", "ohm's law", "current", "voltage", "potential difference", "resistance", "resistor",
      "resistivity", "joule", "watt", "power", "ammeter", "voltmeter", "circuit", "fuse",
      "magnet", "magnetic field", "lorentz", "solenoid", "electromagnet", "fleming",
      "motor", "generator", "electromagnetic induction", "faraday", "lenz",
      "reflection", "refraction", "snell's law", "refractive index", "lens", "mirror",
      "concave", "convex", "focal length", "magnification", "prism", "dispersion",
      "scattering", "tyndall", "human eye", "myopia", "hypermetropia", "presbyopia",
      "newton", "force", "inertia", "momentum", "gravitation", "acceleration", "velocity",
      "friction", "work", "kinetic energy", "potential energy", "coulomb", "electric field",
      "gauss", "capacitance", "capacitor", "torque", "dipole", "kinematics"
    ],
    secondaryKeywords: ["motion", "speed", "charge", "light", "ray", "spectrum", "wire", "gravity", "energy"],
    regexPatterns: [
      /\b(v\s*=\s*i\s*\*?\s*r|f\s*=\s*m\s*\*?\s*a|p\s*=\s*v\s*\*?\s*i)\b/i,
      /\b(ohm'?s?\s*law|snell'?s?\s*law|newton'?s?\s*law|coulomb'?s?\s*law|gauss'?s?\s*law)\b/i,
      /\b(refract(ion|ive)|reflect(ion|ive)|myopi(a|c)|hypermetropi(a|c))\b/i,
    ],
  },

  // 3. CHEMISTRY
  {
    subject: "chemistry",
    primaryKeywords: [
      "chemical reaction", "reaction", "reacts", "quicklime", "slaked lime", "calcium oxide",
      "balanced equation", "chemical equation", "balancing", "reactant", "product", "catalyst",
      "combination reaction", "decomposition", "displacement", "double displacement",
      "redox", "oxidation", "reduction", "oxidizing agent", "reducing agent",
      "acid", "base", "salt", "ph", "litmus", "neutralization", "chlor-alkali",
      "bleaching powder", "baking soda", "washing soda", "plaster of paris", "gypsum",
      "metal", "non-metal", "reactivity series", "ore", "roasting", "calcination", "corrosion",
      "rusting", "alloy", "ionic bond", "covalent bond", "carbon", "tetravalency", "catenation",
      "hydrocarbon", "alkane", "alkene", "alkyne", "homologous series", "functional group",
      "alcohol", "aldehyde", "ketone", "carboxylic acid", "ester", "saponification", "soap",
      "detergent", "periodic table", "atomic radius", "electronegativity", "valency", "mole concept"
    ],
    secondaryKeywords: ["formula", "compound", "element", "solution", "precipitate", "gas", "oxide"],
    regexPatterns: [
      /\b(h2o|co2|o2|h2|nacl|hcl|h2so4|naoh|caco3|ch4|c2h5oh)\b/i,
      /\b(chemical\s*reaction|balanced\s*equation|quicklime|slaked\s*lime|calcium\s*oxide|react(s|ion)?\s+with)\b/i,
      /\b(acid(ic)?|bas(e|ic)|salt|neutraliz(e|ation)|oxid(ation|ize)|reduct(ion|e))\b/i,
      /\b(catenat(ion|ed)|homolog(ous)?|saponificat(ion)?|isomer(ism)?)\b/i,
    ],
  },

  // 4. MATHEMATICS
  {
    subject: "mathematics",
    primaryKeywords: [
      "pythagoras", "theorem", "quadratic", "discriminant", "roots", "zeros",
      "polynomial", "linear equation", "quadratic equation", "arithmetic progression", "ap", "common difference",
      "triangle", "similarity", "congruence", "bpt", "thales", "trigonometry", "sin", "cos",
      "tan", "sec", "cosec", "cot", "heights and distances", "elevation", "depression",
      "circle", "tangent", "secant", "radius", "chord", "surface area", "volume",
      "cylinder", "cone", "sphere", "hemisphere", "frustum", "statistics", "mean",
      "median", "mode", "frequency", "ogive", "probability", "event", "coordinate geometry",
      "distance formula", "section formula", "real numbers", "hcf", "lcm", "irrational",
      "calculus", "differentiation", "integration", "matrix", "determinant"
    ],
    secondaryKeywords: ["calculate", "solve", "evaluate", "value", "graph", "find", "formula", "proof"],
    regexPatterns: [
      /\b(sin|cos|tan|sec|cosec|cot)\s*\(?[0-9a-zθ°]+\)?/i,
      /\b(x\^2|y\^2|a\^2\s*\+\s*b\^2\s*=\s*c\^2)\b/i,
      /\b(pythagor(as|ean)|trigonometr(y|ic)|discriminant|quadratic|arithmetic\s*progression)\b/i,
    ],
  },

  // 5. GEOGRAPHY (Social Science)
  {
    subject: "geography",
    primaryKeywords: [
      "resource", "soil", "alluvial", "black soil", "red soil", "laterite", "erosion",
      "conservation", "forest", "wildlife", "water resources", "dam", "rainwater harvesting",
      "agriculture", "farming", "kharif", "rabi", "zaid", "crop", "rice", "wheat", "cotton",
      "minerals", "iron ore", "bauxite", "coal", "petroleum", "solar energy", "wind energy",
      "manufacturing", "industry", "textile", "iron and steel", "transport", "railways",
      "roadways", "airways", "waterways", "trade", "climate", "monsoon", "plateau"
    ],
    secondaryKeywords: ["map", "india", "region", "earth", "land", "river", "topography"],
    regexPatterns: [
      /\b(alluvial|black\s*soil|rainwater\s*harvesting|kharif|rabi|zaid)\b/i,
      /\b(mineral\s*resource|manufacturing\s*industr(y|ies)|topograph(y|ic))\b/i,
    ],
  },

  // 6. HISTORY (Social Science)
  {
    subject: "history",
    primaryKeywords: [
      "nationalism", "french revolution", "napoleon", "unification of germany", "bismarck",
      "unification of italy", "garibaldi", "cavour", "mazzini", "satyagraha", "gandhi",
      "rowlatt act", "jallianwala bagh", "non-cooperation", "khilafat", "civil disobedience",
      "dandi march", "salt march", "round table conference", "simon commission", "poona pact",
      "silk route", "great depression", "industrial revolution", "print culture", "gutenberg"
    ],
    secondaryKeywords: ["war", "empire", "treaty", "century", "british", "colonial", "movement", "protest"],
    regexPatterns: [
      /\b(satyagraha|jallianwala\s*bagh|non-?cooperation|civil\s*disobedience|dandi\s*march)\b/i,
      /\b(french\s*revolution|unification\s*of\s*(italy|germany)|napoleon(ic)?)\b/i,
    ],
  },

  // 7. ENGLISH
  {
    subject: "english",
    primaryKeywords: [
      "tense", "active voice", "passive voice", "direct speech", "indirect speech", "narration",
      "preposition", "conjunction", "modal", "letter writing", "formal letter", "editorial letter",
      "notice writing", "analytical paragraph", "essay", "comprehension", "passage", "poetic device",
      "metaphor", "simile", "alliteration", "personification", "rhyme scheme", "theme", "character sketch"
    ],
    secondaryKeywords: ["grammar", "poem", "poet", "author", "sentence", "vocabulary", "synonym", "antonym"],
    regexPatterns: [
      /\b(active\s*voice|passive\s*voice|direct\s*speech|reported\s*speech)\b/i,
      /\b(poetic\s*device|rhyme\s*scheme|analytical\s*paragraph|character\s*sketch)\b/i,
    ],
  },

  // 8. COMPUTER SCIENCE
  {
    subject: "computer_science",
    primaryKeywords: [
      "python", "variable", "data type", "list", "tuple", "dictionary", "string", "loop",
      "for loop", "while loop", "function", "def", "recursion", "file handling", "csv",
      "sql", "select", "from", "where", "group by", "order by", "primary key", "foreign key",
      "database", "rdbms", "boolean logic", "logic gate", "and gate", "or gate", "not gate",
      "binary", "stack", "queue", "network", "ip address", "mac address", "tcp/ip", "cyber ethics"
    ],
    secondaryKeywords: ["code", "program", "syntax", "algorithm", "output", "debug", "computer"],
    regexPatterns: [
      /\b(python|sql\s*query|select\s+.*\s+from|rdbms|data\s*structure)\b/i,
      /\b(def\s+[a-z_]+\(.*\):|for\s+[a-z_]+\s+in\s+|while\s+.*:)\b/i,
    ],
  },
];

export interface ClassificationResult {
  detectedSubject: EducationalSubject;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  matchedRuleScore: number;
  matchedKeywords: string[];
  requiresClarification: boolean;
}

export class SubjectClassifier {
  /**
   * Classify user query into standardized academic subject
   */
  public static classify(query: string, currentSubjectHint?: string): ClassificationResult {
    const qLower = (query || "").toLowerCase().trim();
    if (!qLower) {
      return {
        detectedSubject: (currentSubjectHint as EducationalSubject) || "biology",
        confidence: "LOW",
        matchedRuleScore: 0,
        matchedKeywords: [],
        requiresClarification: true,
      };
    }

    const scores: { subject: EducationalSubject; score: number; keywords: string[] }[] = [];

    for (const rule of SUBJECT_RULES) {
      let score = 0;
      const matchedKeywords: string[] = [];

      // Check regex patterns (weight 4)
      for (const rx of rule.regexPatterns) {
        if (rx.test(qLower)) {
          score += 4;
          matchedKeywords.push(rx.source);
        }
      }

      // Check primary keywords (weight 3)
      for (const kw of rule.primaryKeywords) {
        if (qLower.includes(kw)) {
          score += 3;
          matchedKeywords.push(kw);
        }
      }

      // Check secondary keywords (weight 1)
      for (const kw of rule.secondaryKeywords) {
        if (qLower.includes(kw)) {
          score += 1;
        }
      }

      scores.push({ subject: rule.subject, score, keywords: matchedKeywords });
    }

    // Sort by descending score
    scores.sort((a, b) => b.score - a.score);
    const topMatch = scores[0];

    // Evaluate confidence
    if (topMatch && topMatch.score >= 4) {
      return {
        detectedSubject: topMatch.subject,
        confidence: "HIGH",
        matchedRuleScore: topMatch.score,
        matchedKeywords: topMatch.keywords,
        requiresClarification: false,
      };
    }

    if (topMatch && topMatch.score >= 2) {
      return {
        detectedSubject: topMatch.subject,
        confidence: "MEDIUM",
        matchedRuleScore: topMatch.score,
        matchedKeywords: topMatch.keywords,
        requiresClarification: false,
      };
    }

    // If query has low score, prefer current subject hint if provided
    if (currentSubjectHint) {
      const normalizedHint = currentSubjectHint.toLowerCase() as EducationalSubject;
      const validHint = SUBJECT_RULES.find((r) => r.subject === normalizedHint);
      if (validHint) {
        return {
          detectedSubject: normalizedHint,
          confidence: "MEDIUM",
          matchedRuleScore: 1,
          matchedKeywords: ["current_context_hint"],
          requiresClarification: false,
        };
      }
    }

    // Very ambiguous question (e.g. "Explain this", "Solve it", "What is the answer?")
    return {
      detectedSubject: "biology", // Default anchor
      confidence: "LOW",
      matchedRuleScore: 0,
      matchedKeywords: [],
      requiresClarification: true,
    };
  }
}
