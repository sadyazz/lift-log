import Link from "next/link";
import { NewPlanForm } from "@/components/plans/new-plan-form";

export default function NewPlanPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <h1 className="text-4xl font-extrabold tracking-tight">new plan</h1>

      <NewPlanForm />

      <Link href="/plans" className="text-sm text-muted-foreground underline">
        cancel
      </Link>
    </div>
  );
}
