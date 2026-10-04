// ==============================================================================
// EDUVERSE AI — BOARD & CLASS BOUNDARY ISOLATION (PHASE 20)
// Prevents cross-contamination between Class 10 / 11 / 12 and different educational boards
// ==============================================================================

import { BoardIdentifier, AcademicClassLevel } from "@/types/education-hierarchy";

export interface BoundaryIsolationDecision {
  targetBoard: BoardIdentifier;
  targetClass: AcademicClassLevel;
  isCrossBoardComparison: boolean;
  isCrossClassComparison: boolean;
  allowedBoards: BoardIdentifier[];
  allowedClasses: AcademicClassLevel[];
  enforceStrictIsolation: boolean;
  isolationNotice?: string;
}

export class BoardClassIsolator {
  /**
   * Evaluates user query to determine whether to isolate or permit multi-board / multi-class retrieval
   */
  public static evaluateBoundary(
    currentBoard: string,
    currentClass: number,
    userQuery: string
  ): BoundaryIsolationDecision {
    const qLower = (userQuery || "").toLowerCase();
    const normalizedBoard = (currentBoard || "cbse").toLowerCase() as BoardIdentifier;
    const normalizedClass = (Number(currentClass) === 11 ? 11 : Number(currentClass) === 12 ? 12 : 10) as AcademicClassLevel;

    // Detect explicit comparison requests
    const isComparingBoards = /\b(compare|difference between|versus|vs\.?)\b.*(cbse|icse|isc|state board|nios)/i.test(qLower) ||
      /\b(cbse\s+(and|vs\.?|or)\s+(icse|isc|nios|state))\b/i.test(qLower);

    const isComparingClasses = /\b(difference between|compare|in class 10 vs (class )?12|class 11 vs (class )?12)\b/i.test(qLower);

    // Check if student explicitly requests a different board
    let requestedBoard: BoardIdentifier = normalizedBoard;
    if (/\b(icse|cisce)\b/i.test(qLower)) requestedBoard = "cisce";
    else if (/\b(isc)\b/i.test(qLower)) requestedBoard = "cisce";
    else if (/\b(cbse)\b/i.test(qLower)) requestedBoard = "cbse";
    else if (/\b(nios)\b/i.test(qLower)) requestedBoard = "nios";
    else if (/\b(maharashtra|hsc|ssc)\b/i.test(qLower)) requestedBoard = "msbshse";
    else if (/\b(up board|upmsp)\b/i.test(qLower)) requestedBoard = "upmsp";
    else if (/\b(karnataka|sslc|puc)\b/i.test(qLower)) requestedBoard = "kseab";

    // Check if student explicitly requests a different class
    let requestedClass: AcademicClassLevel = normalizedClass;
    if (/\b(class\s*10|10th\s*board|grade\s*10)\b/i.test(qLower)) requestedClass = 10;
    else if (/\b(class\s*11|11th\s*grade|grade\s*11)\b/i.test(qLower)) requestedClass = 11;
    else if (/\b(class\s*12|12th\s*board|grade\s*12)\b/i.test(qLower)) requestedClass = 12;

    if (isComparingBoards) {
      return {
        targetBoard: normalizedBoard,
        targetClass: normalizedClass,
        isCrossBoardComparison: true,
        isCrossClassComparison: false,
        allowedBoards: ["cbse", "cisce", "nios", "msbshse", "upmsp", "kseab"],
        allowedClasses: [normalizedClass],
        enforceStrictIsolation: false,
        isolationNotice: "Cross-board comparative analysis mode activated.",
      };
    }

    if (isComparingClasses) {
      return {
        targetBoard: requestedBoard,
        targetClass: normalizedClass,
        isCrossBoardComparison: false,
        isCrossClassComparison: true,
        allowedBoards: [requestedBoard],
        allowedClasses: [10, 11, 12],
        enforceStrictIsolation: false,
        isolationNotice: "Cross-class developmental progression mode activated.",
      };
    }

    // Default: Strict Isolation
    return {
      targetBoard: requestedBoard,
      targetClass: requestedClass,
      isCrossBoardComparison: false,
      isCrossClassComparison: false,
      allowedBoards: [requestedBoard],
      allowedClasses: [requestedClass],
      enforceStrictIsolation: true,
      isolationNotice: `Strict context isolation enforced: ${requestedBoard.toUpperCase()} Class ${requestedClass}.`,
    };
  }
}
