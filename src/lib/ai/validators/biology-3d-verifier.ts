// ==============================================================================
// EDUVERSE AI — BIOLOGY & 3D VISUAL CONTEXT VERIFIER (PHASE 28 & 29)
// Grounds questions like "what does this do?" or "this part" into the currently selected 3D anatomical structure
// ==============================================================================

import { ANATOMICAL_STRUCTURES, CELL_ORGANELLES, AnatomicalStructure, CellOrganelle } from "@/lib/data/biology-data";

export interface Grounded3DContext {
  is3DReferenced: boolean;
  objectId?: string;
  objectName?: string;
  specificPartId?: string;
  specificPartName?: string;
  anatomicalFunction?: string;
  boardKeyPoints: string[];
  boardExamTip?: string;
  focusExplanationPrompt?: string;
}

export class Biology3DVerifier {
  /**
   * Resolves deictic references ("this", "this organ", "what does this part do?") to the active 3D selection
   */
  public static resolve3DGrounding(
    userQuery: string,
    current3DObject?: string,
    selectedPartId?: string
  ): Grounded3DContext {
    const qLower = (userQuery || "").toLowerCase();
    const isDeictic = /\b(this|that|this part|that organ|selected part|what does it do|what does this do|function of this)\b/i.test(qLower);

    // 1. Look up by explicit selectedPartId or current3DObject
    let matchedStructure: AnatomicalStructure | undefined;
    let matchedOrganelle: CellOrganelle | undefined;

    const targetKey = (selectedPartId || current3DObject || "").toLowerCase().trim();

    if (targetKey) {
      matchedStructure = ANATOMICAL_STRUCTURES.find(
        (s) => s.id.toLowerCase() === targetKey || s.name.toLowerCase().includes(targetKey) || targetKey.includes(s.id.toLowerCase())
      );

      if (!matchedStructure) {
        matchedOrganelle = CELL_ORGANELLES.find(
          (o) => o.id.toLowerCase() === targetKey || o.name.toLowerCase().includes(targetKey) || targetKey.includes(o.id.toLowerCase())
        );
      }
    }

    // 2. If query mentions a specific organ directly (e.g. "heart", "left ventricle", "mitochondria")
    if (!matchedStructure && !matchedOrganelle) {
      matchedStructure = ANATOMICAL_STRUCTURES.find(
        (s) => qLower.includes(s.name.toLowerCase()) || qLower.includes(s.id.toLowerCase())
      );

      if (!matchedStructure) {
        matchedOrganelle = CELL_ORGANELLES.find(
          (o) => qLower.includes(o.name.toLowerCase()) || qLower.includes(o.id.toLowerCase())
        );
      }
    }

    if (matchedStructure) {
      return {
        is3DReferenced: true,
        objectId: matchedStructure.id,
        objectName: matchedStructure.name,
        specificPartId: matchedStructure.id,
        specificPartName: matchedStructure.name,
        anatomicalFunction: matchedStructure.function,
        boardKeyPoints: matchedStructure.ncertKeyPoints,
        boardExamTip: matchedStructure.boardExamTips,
        focusExplanationPrompt: `SPECIFIC 3D OBJECT IN FOCUS: "${matchedStructure.name}" (System: ${matchedStructure.system}).
Official Function: ${matchedStructure.function}
NCERT Curriculum Key Points:
${matchedStructure.ncertKeyPoints.map((p) => `• ${p}`).join("\n")}
Board Exam Scoring Focus: ${matchedStructure.boardExamTips}
CRITICAL INSTRUCTION: The student asked about THIS SPECIFIC PART. Answer specifically about ${matchedStructure.name}. Do not diverge into the entire body system.`,
      };
    }

    if (matchedOrganelle) {
      return {
        is3DReferenced: true,
        objectId: matchedOrganelle.id,
        objectName: matchedOrganelle.name,
        specificPartId: matchedOrganelle.id,
        specificPartName: matchedOrganelle.name,
        anatomicalFunction: matchedOrganelle.function,
        boardKeyPoints: [
          `Function: ${matchedOrganelle.function}`,
          `Biological Analogy: ${matchedOrganelle.analogy}`,
          `Enzymes/Pigments: ${matchedOrganelle.keyEnzymesOrPigments}`,
        ],
        boardExamTip: matchedOrganelle.boardSignificance,
        focusExplanationPrompt: `SPECIFIC 3D CELL ORGANELLE IN FOCUS: "${matchedOrganelle.name}".
Function: ${matchedOrganelle.function}
Analogy: ${matchedOrganelle.analogy}
Board Significance: ${matchedOrganelle.boardSignificance}
CRITICAL INSTRUCTION: Answer specifically regarding this organelle (${matchedOrganelle.name}).`,
      };
    }

    return {
      is3DReferenced: isDeictic && Boolean(current3DObject),
      objectId: current3DObject,
      objectName: current3DObject,
      boardKeyPoints: [],
    };
  }
}
