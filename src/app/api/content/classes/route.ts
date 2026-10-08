import { NextResponse } from "next/server";

export async function GET() {
  const classes = [
    {
      classLevel: 10,
      title: "Class 10 (Secondary Examination)",
      examPattern: "Board Examination (AISSE / ICSE / State Matriculation)",
      streams: ["general_10th"],
      coreSubjects: ["Science", "Mathematics", "Social Science", "English", "Hindi"],
      standardTotalMarks: 500,
    },
    {
      classLevel: 11,
      title: "Class 11 (Senior Secondary - Stage 1)",
      examPattern: "Annual Comprehensive Examination & Continuous Assessment",
      streams: ["science_pcm", "science_pcb", "commerce", "humanities"],
      coreSubjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Accountancy", "Economics"],
      standardTotalMarks: 500,
    },
    {
      classLevel: 12,
      title: "Class 12 (Senior Secondary School Examination)",
      examPattern: "National / State Board Certificate (AISSCE / ISC / HSC)",
      streams: ["science_pcm", "science_pcb", "commerce", "humanities"],
      coreSubjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Economics", "Computer Science"],
      standardTotalMarks: 500,
    },
  ];

  return NextResponse.json({
    success: true,
    totalCount: classes.length,
    classes,
    timestamp: new Date().toISOString(),
  });
}
