import { PlannerClient } from "@/app/components/planner-client";
import { getPlannerData } from "@/app/lib/db";

export default function Home() {
  const { items, sessions, reminders } = getPlannerData();

  return <PlannerClient items={items} sessions={sessions} reminders={reminders} />;
}
