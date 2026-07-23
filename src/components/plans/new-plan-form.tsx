"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { WeekdayPicker } from "@/components/plans/weekday-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRoutine } from "@/app/(app)/plans/new/actions";
import { isRedirectError } from "@/lib/is-redirect-error";

export function NewPlanForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createRoutine(formData);
        toast.success("plan created");
      } catch (err) {
        if (isRedirectError(err)) throw err;
        toast.error("failed to create plan");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">name</Label>
        <Input id="name" name="name" placeholder="leg day" required className="h-11" />
      </div>

      <div className="flex flex-col gap-2">
        <Label>which days?</Label>
        <WeekdayPicker />
      </div>

      <Button type="submit" disabled={isPending} className="w-full py-6 text-base">
        {isPending ? "creating..." : "create plan"}
      </Button>
    </form>
  );
}
