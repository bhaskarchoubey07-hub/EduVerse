import { redirect } from "next/navigation";

const SUBJECT_ROUTES: Record<string, string> = {
  biology: "/learn/biology",
  biology_lab: "/learn/biology",
  biology_cell: "/learn/biology",
  chemistry: "/learn/chemistry",
  chemistry_molecular: "/learn/chemistry",
  physics: "/learn/physics",
  physics_optics: "/learn/physics",
  mathematics: "/learn/mathematics",
  math: "/learn/mathematics",
  math_geometry: "/learn/mathematics",
  geography: "/learn/geography",
  history: "/learn/history",
};

export default async function SubjectRedirectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const target = SUBJECT_ROUTES[subjectId.toLowerCase()] || "/learn/universe";
  redirect(target);
}
