// ==============================================================================
// EDUVERSE AI — DETERMINISTIC MATH & PHYSICS VERIFIER (PHASE 26)
// Prevents AI calculation hallucinations through deterministic arithmetic checks
// ==============================================================================

export interface FormulaVerificationResult {
  verified: boolean;
  formulaIdentified?: string;
  expectedValue?: number | string;
  extractedValue?: number | string;
  discrepancyDetected: boolean;
  correctionText?: string;
  notes: string;
}

export class MathPhysicsVerifier {
  /**
   * Deterministically validates numerical problems and standard formula applications
   */
  public static verifyNumerical(query: string, responseContent: string): FormulaVerificationResult {
    const text = responseContent.toLowerCase();

    // 1. Ohm's Law Check (V = I * R)
    // Example: "V = 12V, R = 4 ohm, find I" -> I = 3A
    const ohmMatch = query.match(/(?:potential difference|voltage|v)\s*=\s*(\d+(?:\.\d+)?)\s*v?.*?(?:resistance|r)\s*=\s*(\d+(?:\.\d+)?)\s*(?:ohm|Ω)/i) ||
                     query.match(/(\d+(?:\.\d+)?)\s*v(?:olts?)?.*?(?:and\s+)?(\d+(?:\.\d+)?)\s*(?:ohm|Ω)/i);

    if (ohmMatch) {
      const v = parseFloat(ohmMatch[1]);
      const r = parseFloat(ohmMatch[2]);
      if (r > 0) {
        const expectedCurrent = Math.round((v / r) * 100) / 100;
        // Check if response contains expectedCurrent
        const hasExpected = new RegExp(`\\b${expectedCurrent}\\s*(?:a|amp|amperes?)\\b`, "i").test(text) ||
                            text.includes(`${expectedCurrent} a`) || text.includes(`= ${expectedCurrent}`);

        return {
          verified: hasExpected,
          formulaIdentified: "Ohm's Law: I = V / R",
          expectedValue: `${expectedCurrent} A`,
          discrepancyDetected: !hasExpected,
          correctionText: !hasExpected ? `Deterministic calculation: I = V / R = ${v} / ${r} = ${expectedCurrent} A.` : undefined,
          notes: hasExpected ? "Ohm's law numerical verified deterministically." : "AI output deviated from V/R arithmetic calculation.",
        };
      }
    }

    // 2. Power Equation Check (P = V * I)
    const powerMatch = query.match(/(\d+(?:\.\d+)?)\s*v(?:olts?)?.*?(\d+(?:\.\d+)?)\s*(?:a|amp|amperes?)/i);
    if (powerMatch) {
      const v = parseFloat(powerMatch[1]);
      const i = parseFloat(powerMatch[2]);
      const expectedP = Math.round(v * i * 100) / 100;
      const hasExpected = new RegExp(`\\b${expectedP}\\s*(?:w|watts?)\\b`, "i").test(text) || text.includes(`= ${expectedP}`);

      return {
        verified: hasExpected,
        formulaIdentified: "Electric Power: P = V * I",
        expectedValue: `${expectedP} W`,
        discrepancyDetected: !hasExpected,
        correctionText: !hasExpected ? `Deterministic calculation: P = V * I = ${v} * ${i} = ${expectedP} W.` : undefined,
        notes: hasExpected ? "Power calculation verified." : "AI output deviated from V*I arithmetic calculation.",
      };
    }

    // 3. Pythagoras Theorem Check (a^2 + b^2 = c^2)
    const pythagMatch = query.match(/(?:sides?|perpendicular|base|legs?)\s*(?:of\s+)?(\d+(?:\.\d+)?)\s*(?:cm|m)?\s*(?:and|,)\s*(\d+(?:\.\d+)?)\s*(?:cm|m)?/i);
    if (pythagMatch && /hypotenuse|pythagor/i.test(query)) {
      const a = parseFloat(pythagMatch[1]);
      const b = parseFloat(pythagMatch[2]);
      const c = Math.round(Math.sqrt(a * a + b * b) * 100) / 100;
      const hasHyp = new RegExp(`\\b${c}\\s*(?:cm|m|units)?\\b`, "i").test(text) || text.includes(`= ${c}`);

      return {
        verified: hasHyp,
        formulaIdentified: "Pythagoras Theorem: c = sqrt(a^2 + b^2)",
        expectedValue: c,
        discrepancyDetected: !hasHyp,
        correctionText: !hasHyp ? `Hypotenuse = √(a² + b²) = √(${a}² + ${b}²) = √${a * a + b * b} = ${c}.` : undefined,
        notes: hasHyp ? "Pythagoras calculation verified." : "AI calculation differed from deterministic root.",
      };
    }

    // 4. Kinetic Energy Check (KE = 0.5 * m * v^2)
    const keMatch = query.match(/(?:mass|m)\s*=\s*(\d+(?:\.\d+)?)\s*kg.*?velocity\s*=\s*(\d+(?:\.\d+)?)\s*m\/s/i);
    if (keMatch) {
      const m = parseFloat(keMatch[1]);
      const v = parseFloat(keMatch[2]);
      const ke = Math.round(0.5 * m * v * v * 100) / 100;
      const hasKE = new RegExp(`\\b${ke}\\s*(?:j|joules?)\\b`, "i").test(text) || text.includes(`= ${ke}`);

      return {
        verified: hasKE,
        formulaIdentified: "Kinetic Energy: KE = 0.5 * m * v^2",
        expectedValue: `${ke} J`,
        discrepancyDetected: !hasKE,
        correctionText: !hasKE ? `KE = 1/2 * m * v² = 0.5 * ${m} * (${v})² = ${ke} J.` : undefined,
        notes: hasKE ? "KE calculation verified." : "AI calculation error in kinetic energy.",
      };
    }

    return {
      verified: true,
      discrepancyDetected: false,
      notes: "No deterministic numerical discrepancy detected in response.",
    };
  }
}
