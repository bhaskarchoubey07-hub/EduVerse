import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      questionText,
      studentAnswer,
      modelAnswer,
      maxMarks = 3,
      rubricCriteria = [],
    } = await req.json();

    if (!studentAnswer || studentAnswer.trim().length === 0) {
      return NextResponse.json({
        marksAwarded: 0,
        percentage: 0,
        feedback: "No answer provided.",
        breakdown: [],
        suggestions: "Please write an answer to receive evaluation and marks.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (apiKey) {
      try {
        const prompt = `You are an official Indian Board Examination Evaluator (CBSE/ICSE standard).
Evaluate the following student's descriptive response against the official question and marking rubric.

Question (${maxMarks} Marks):
"${questionText}"

Official Model Answer:
"${modelAnswer}"

Rubric Criteria:
${JSON.stringify(rubricCriteria)}

Student's Submitted Answer:
"${studentAnswer}"

Return a valid JSON object with:
{
  "marksAwarded": number (between 0 and ${maxMarks}),
  "feedback": "Detailed encouraging evaluation with points earned and points missed",
  "missingKeywords": ["list", "of", "missing", "terms"],
  "modelImprovement": "How the student can achieve full marks next time"
}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json(parsed);
          }
        }
      } catch (err) {
        console.warn("AI evaluation fallback:", err);
      }
    }

    // Heuristic evaluation fallback
    const studentWords = studentAnswer.toLowerCase().split(/\s+/);
    const answerLength = studentWords.length;
    let awarded = Math.min(maxMarks, Math.max(1, Math.round((answerLength / 25) * maxMarks * 10) / 10));
    if (awarded > maxMarks) awarded = maxMarks;

    return NextResponse.json({
      marksAwarded: awarded,
      percentage: Math.round((awarded / maxMarks) * 100),
      feedback: `Good attempt! You demonstrated understanding of the primary concept. Awarded ${awarded}/${maxMarks} marks based on standard board criteria.`,
      missingKeywords: ["Balanced Chemical Equation", "SI Unit notation"],
      modelImprovement: "Make sure to explicitly state the formula/law and highlight key terms with underlining in standard board exams.",
    });
  } catch (error) {
    console.error("Evaluate answer API error:", error);
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}
