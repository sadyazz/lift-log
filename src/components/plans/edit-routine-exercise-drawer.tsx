"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateRoutineExercise } from "@/app/(app)/plans/[id]/actions";

export function EditRoutineExerciseDrawer({
  routineExercise,
}: {
  routineExercise: {
    id: string;
    name: string;
    target_sets: number | null;
    target_reps: number | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateRoutineExercise(formData);
        setOpen(false);
        toast.success("exercise updated");
      } catch {
        toast.error("failed to save changes");
      }
    });
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger render={<Button type="button" variant="ghost" size="sm" />}>
        edit
      </DrawerTrigger>
      <DrawerContent className="min-h-[50vh]">
        <DrawerHeader>
          <DrawerTitle>{routineExercise.name}</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
          <input type="hidden" name="routineExerciseId" value={routineExercise.id} />
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="targetSets">sets</Label>
              <Input
                key={`sets-${routineExercise.id}-${routineExercise.target_sets}`}
                id="targetSets"
                name="targetSets"
                type="number"
                inputMode="numeric"
                min="1"
                defaultValue={routineExercise.target_sets ?? ""}
                className="h-11"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="targetReps">reps</Label>
              <Input
                key={`reps-${routineExercise.id}-${routineExercise.target_reps}`}
                id="targetReps"
                name="targetReps"
                type="number"
                inputMode="numeric"
                min="1"
                defaultValue={routineExercise.target_reps ?? ""}
                className="h-11"
              />
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="w-full rounded-lg py-6 text-base">
            {isPending ? "saving..." : "save changes"}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
