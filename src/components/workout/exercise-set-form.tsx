"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SetRowMenu } from "@/components/workout/set-row-menu";
import { addSet, removeWorkoutExercise, updateExercise } from "@/app/(app)/workout/[id]/actions";
import { isRedirectError } from "@/lib/is-redirect-error";

type SetRow = {
  id: string;
  weight: number | null;
  reps: number | null;
  is_warmup: boolean;
  is_failure: boolean;
};

export function ExerciseSetForm({
  workoutId,
  workoutExerciseId,
  sets,
}: {
  workoutId: string;
  workoutExerciseId: string;
  sets: SetRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const setIds = sets.map((s) => s.id).join(",");

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const submitter = e.nativeEvent.submitter as HTMLButtonElement | null;
    const action = submitter?.dataset.action ?? "save";

    startTransition(async () => {
      try {
        if (action === "addSet") {
          await addSet(formData);
          toast.success("set added");
        } else if (action === "remove") {
          await removeWorkoutExercise(workoutId, formData);
        } else {
          await updateExercise(workoutId, formData);
          toast.success("saved");
        }
      } catch (err) {
        if (isRedirectError(err)) throw err;
        toast.error(
          action === "addSet"
            ? "failed to add set"
            : action === "remove"
              ? "failed to remove exercise"
              : "failed to save"
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input type="hidden" name="workoutExerciseId" value={workoutExerciseId} />
      <input type="hidden" name="setIds" value={setIds} />

      <div className="flex items-center justify-between text-xs font-semibold tracking-widest text-muted-foreground">
        <span>sets</span>
        <span>{sets.length} sets</span>
      </div>

      <div className="flex flex-col divide-y divide-border">
        <div className="grid grid-cols-[2.5rem_4rem_1fr_2.5rem] items-center gap-2 pb-3 text-xs font-medium text-muted-foreground">
          <span>set</span>
          <span>kg</span>
          <span>reps</span>
          <span></span>
        </div>
        {sets.map((set, i) => (
          <div
            key={set.id}
            data-set-row={set.id}
            className="grid grid-cols-[2.5rem_4rem_1fr_2.5rem] items-center gap-2 py-5"
          >
            <span className="text-sm text-muted-foreground">{i + 1}</span>
            <Input
              key={`weight-${set.id}-${set.weight}`}
              type="text"
              inputMode="decimal"
              name={`weight__${set.id}`}
              defaultValue={set.weight ?? ""}
              className="h-11 w-16 border-none bg-transparent px-0 text-xl font-bold shadow-none focus-visible:ring-0"
            />
            <Input
              key={`reps-${set.id}-${set.reps}`}
              type="number"
              inputMode="numeric"
              name={`reps__${set.id}`}
              defaultValue={set.reps ?? ""}
              className="h-11 w-16 border-none bg-transparent px-0 text-xl font-bold shadow-none focus-visible:ring-0"
            />
            <SetRowMenu setId={set.id} isWarmup={set.is_warmup} isFailure={set.is_failure} />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        <Button
          type="submit"
          data-action="addSet"
          disabled={isPending}
          variant="ghost"
          className="gap-1"
        >
          <Plus className="size-4" />
          add set
        </Button>
        <Button
          type="submit"
          data-action="save"
          disabled={isPending}
          className="w-full rounded-lg py-6 text-base"
        >
          {isPending ? "saving..." : "save"}
        </Button>
      </div>

      <div className="flex items-center justify-end border-t border-border pt-4">
        <Button
          type="submit"
          data-action="remove"
          disabled={isPending}
          variant="ghost"
          size="sm"
          className="text-destructive"
        >
          remove exercise
        </Button>
      </div>
    </form>
  );
}
