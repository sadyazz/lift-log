"use client";

import { useTransition } from "react";
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
import { createExercise } from "@/app/(app)/exercises/actions";
import { isRedirectError } from "@/lib/is-redirect-error";

export function AddExerciseLibraryDrawer() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createExercise(formData);
        toast.success("exercise created");
      } catch (err) {
        if (isRedirectError(err)) throw err;
        toast.error("failed to create exercise");
      }
    });
  }

  return (
    <Drawer>
      <DrawerTrigger render={<Button className="rounded-lg" />}>
        <Plus className="size-4" />
        add exercise
      </DrawerTrigger>
      <DrawerContent className="min-h-[50vh]">
        <DrawerHeader>
          <DrawerTitle>add exercise</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">exercise</Label>
            <Input id="name" name="name" placeholder="hip thrust" required className="h-11" />
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
      </DrawerContent>
    </Drawer>
  );
}
