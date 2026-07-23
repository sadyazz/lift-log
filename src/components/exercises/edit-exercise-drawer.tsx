"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
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
import { updateExercise } from "@/app/(app)/exercises/actions";

export function EditExerciseDrawer({
  exercise,
}: {
  exercise: { id: string; name: string; muscle_group: string | null; equipment: string | null };
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateExercise(formData);
        setOpen(false);
        toast.success("exercise updated");
      } catch {
        toast.error("failed to save changes");
      }
    });
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger render={<Button variant="outline" className="flex-1 rounded-lg" />}>
        <Pencil className="size-4" />
        edit exercise
      </DrawerTrigger>
      <DrawerContent className="min-h-[50vh]">
        <DrawerHeader>
          <DrawerTitle>edit exercise</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
          <input type="hidden" name="exerciseId" value={exercise.id} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">exercise</Label>
            <Input
              key={`name-${exercise.id}-${exercise.name}`}
              id="name"
              name="name"
              defaultValue={exercise.name}
              required
              className="h-11"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="muscleGroup">category</Label>
            <MuscleGroupSelect
              key={`muscle-group-${exercise.id}-${exercise.muscle_group}`}
              id="muscleGroup"
              defaultValue={exercise.muscle_group ?? "other"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="equipment">equipment (optional)</Label>
            <Input
              key={`equipment-${exercise.id}-${exercise.equipment}`}
              id="equipment"
              name="equipment"
              defaultValue={exercise.equipment ?? ""}
              placeholder="barbell"
              className="h-11"
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full rounded-lg py-6 text-base">
            {isPending ? "saving..." : "save changes"}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
