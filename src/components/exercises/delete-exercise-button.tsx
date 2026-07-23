"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteExercise } from "@/app/(app)/exercises/actions";

export function DeleteExerciseButton({ exerciseId }: { exerciseId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const formData = new FormData();
    formData.set("exerciseId", exerciseId);

    startTransition(async () => {
      try {
        await deleteExercise(formData);
        toast.success("exercise deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "failed to delete exercise");
      }
    });
  }

  return (
    <Button
      type="button"
      variant="destructive"
      disabled={isPending}
      onClick={handleClick}
      className="flex-1 rounded-lg"
    >
      <Trash2 className="size-4" />
      {isPending ? "deleting..." : "delete exercise"}
    </Button>
  );
}
