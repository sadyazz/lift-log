"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Flame, Skull, Copy, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  toggleWarmupSet,
  toggleFailureSet,
  duplicateSet,
  removeSet,
} from "@/app/(app)/workout/[id]/actions";

export function SetRowMenu({
  setId,
  isWarmup,
  isFailure,
}: {
  setId: string;
  isWarmup: boolean;
  isFailure: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        ref={triggerRef}
        type="button"
        disabled={isPending}
        className="flex size-8 items-center justify-center text-muted-foreground"
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            startTransition(async () => {
              try {
                await toggleWarmupSet(setId, !isWarmup, new FormData());
              } catch {
                toast.error("failed to update set");
              }
            })
          }
        >
          <Flame className="size-4" />
          {isWarmup ? "unmark warmup" : "mark as warmup"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            startTransition(async () => {
              try {
                await toggleFailureSet(setId, !isFailure, new FormData());
              } catch {
                toast.error("failed to update set");
              }
            })
          }
        >
          <Skull className="size-4" />
          {isFailure ? "unmark until failure" : "mark until failure"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            startTransition(async () => {
              const row = triggerRef.current?.closest(`[data-set-row="${setId}"]`);
              const weightInput = row?.querySelector<HTMLInputElement>(
                `input[name="weight__${setId}"]`
              );
              const repsInput = row?.querySelector<HTMLInputElement>(
                `input[name="reps__${setId}"]`
              );

              const formData = new FormData();
              if (weightInput) formData.set(`weight__${setId}`, weightInput.value);
              if (repsInput) formData.set(`reps__${setId}`, repsInput.value);

              try {
                await duplicateSet(setId, formData);
                toast.success("set duplicated");
              } catch {
                toast.error("failed to duplicate set");
              }
            })
          }
        >
          <Copy className="size-4" />
          duplicate set
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() =>
            startTransition(async () => {
              try {
                await removeSet(setId, new FormData());
              } catch {
                toast.error("failed to delete set");
              }
            })
          }
        >
          <Trash2 className="size-4" />
          delete set
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
