"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { MuscleGroupSelect } from "@/components/exercises/muscle-group-select";
import { muscleGroupLabel } from "@/lib/muscle-groups";
import {
  addWorkoutExercise,
  addExistingWorkoutExercise,
} from "@/app/(app)/workout/[id]/actions";

type ExerciseOption = { id: string; name: string; muscle_group: string | null };

export function AddWorkoutExerciseDrawer({
  workoutId,
  exercises,
}: {
  workoutId: string;
  exercises: ExerciseOption[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(exercises.length === 0);
  const [isPending, startTransition] = useTransition();

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  function handlePick(e: React.SubmitEvent<HTMLFormElement>, name: string) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await addExistingWorkoutExercise(formData);
        setOpen(false);
        toast.success(`${name} added`);
      } catch {
        toast.error("failed to add exercise");
      }
    });
  }

  function handleCreate(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await addWorkoutExercise(formData);
        setOpen(false);
        toast.success("exercise added");
      } catch {
        toast.error("failed to add exercise");
      }
    });
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setQuery("");
          setShowCreate(exercises.length === 0);
        }
      }}
    >
      <DrawerTrigger className="flex w-full items-center gap-3 p-4 text-left">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Plus className="size-4" />
        </span>
        <span className="font-semibold">add exercise</span>
      </DrawerTrigger>
      <DrawerContent className="min-h-[70vh]">
        <DrawerHeader>
          <DrawerTitle>add exercise</DrawerTitle>
        </DrawerHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
          {exercises.length > 0 && (
            <Input
              placeholder="search exercises"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11"
            />
          )}

          <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
            {filtered.map((ex) => (
              <form key={ex.id} onSubmit={(e) => handlePick(e, ex.name)}>
                <input type="hidden" name="workoutId" value={workoutId} />
                <input type="hidden" name="exerciseId" value={ex.id} />
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex w-full items-center justify-between rounded-xl border border-border p-3 text-left"
                >
                  <span className="font-semibold">{ex.name}</span>
                  {ex.muscle_group && (
                    <span className="text-xs text-muted-foreground">
                      {muscleGroupLabel(ex.muscle_group)}
                    </span>
                  )}
                </button>
              </form>
            ))}
            {exercises.length > 0 && filtered.length === 0 && (
              <p className="p-2 text-sm text-muted-foreground">no matching exercises</p>
            )}
          </div>

          {!showCreate ? (
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-lg py-6 text-base"
              onClick={() => setShowCreate(true)}
            >
              create new exercise
            </Button>
          ) : (
            <form
              onSubmit={handleCreate}
              className="flex flex-col gap-4 border-t border-border pt-4"
            >
              <input type="hidden" name="workoutId" value={workoutId} />
              <div className="flex flex-col gap-2">
                <Label htmlFor="exerciseName">exercise</Label>
                <Input
                  id="exerciseName"
                  name="exerciseName"
                  defaultValue={query}
                  placeholder="bicep curl"
                  required
                  className="h-11"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="muscleGroup">category</Label>
                <MuscleGroupSelect id="muscleGroup" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="equipment">equipment (optional)</Label>
                <Input id="equipment" name="equipment" placeholder="barbell" className="h-11" />
              </div>
              <Button type="submit" disabled={isPending} className="w-full rounded-lg py-6 text-base">
                {isPending ? "adding..." : "add exercise"}
              </Button>
            </form>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
