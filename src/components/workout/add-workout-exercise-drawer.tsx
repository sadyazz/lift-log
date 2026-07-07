"use client";

import { useState } from "react";
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
import { addWorkoutExercise } from "@/app/(app)/workout/[id]/actions";

export function AddWorkoutExerciseDrawer({ workoutId }: { workoutId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="flex w-full items-center gap-3 p-4 text-left">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Plus className="size-4" />
        </span>
        <span className="font-semibold">add exercise</span>
      </DrawerTrigger>
      <DrawerContent className="min-h-[50vh]">
        <DrawerHeader>
          <DrawerTitle>add exercise</DrawerTitle>
        </DrawerHeader>
        <form
          action={addWorkoutExercise}
          onSubmit={() => setOpen(false)}
          className="flex flex-col gap-4 p-4"
        >
          <input type="hidden" name="workoutId" value={workoutId} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="exerciseName">exercise</Label>
            <Input
              id="exerciseName"
              name="exerciseName"
              placeholder="bicep curl"
              required
              className="h-11"
            />
          </div>
          <Button type="submit" className="w-full rounded-lg py-6 text-base">
            add exercise
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
