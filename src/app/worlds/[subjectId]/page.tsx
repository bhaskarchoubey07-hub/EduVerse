import { redirect } from "next/navigation";

const SUBJECT_ROUTES: Record<string, string> = {
  biology: "/learn/biology",
  chemistry: "/learn/chemistry",
  physics: "/learn/physics",
  mathematics: "/learn/mathematics",
  geography: "/learn/geography",
  history: "/learn/history",
};

export default function SubjectWorldPage({ params }: { params: { subjectId: string } }) {
  const route = SUBJECT_ROUTES[params.subjectId.toLowerCase()];
  if (route) redirect(route);
  redirect("/worlds");
}