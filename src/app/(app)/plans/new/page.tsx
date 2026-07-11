import Link from "next/link";
import { createRoutine } from "./actions";
import { WeekdayPicker } from "@/components/plans/weekday-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewPlanPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <h1 className="text-4xl font-extrabold tracking-tight">new plan</h1>

      <form action={createRoutine} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">name</Label>
          <Input id="name" name="name" placeholder="leg day" required className="h-11" />
        </div>

        <div className="flex flex-col gap-2">
          <Label>which days?</Label>
          <WeekdayPicker />
        </div>

        <Button type="submit" className="w-full py-6 text-base">
          create plan
        </Button>
      </form>

      <Link href="/plans" className="text-sm text-muted-foreground underline">
        cancel
      </Link>
    </div>
  );
}
