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
import { addExercise } from "@/app/(app)/plans/[id]/actions";

export function AddExerciseDrawer({ routineId }: { routineId: string }) {
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
          action={addExercise}
          onSubmit={() => setOpen(false)}
          className="flex flex-col gap-4 p-4"
        >
          <input type="hidden" name="routineId" value={routineId} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="exerciseName">exercise</Label>
            <Input
              id="exerciseName"
              name="exerciseName"
              placeholder="hip thrust"
              required
              className="h-11"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="targetSets">sets</Label>
              <Input
                id="targetSets"
                name="targetSets"
                type="number"
                min="1"
                className="h-11"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="targetReps">reps</Label>
              <Input
                id="targetReps"
                name="targetReps"
                type="number"
                min="1"
                className="h-11"
              />
            </div>
          </div>
          <Button type="submit" className="w-full rounded-lg py-6 text-base">
            add exercise
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
