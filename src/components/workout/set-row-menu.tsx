"use client";

import { useTransition } from "react";
import { MoreHorizontal, Flame, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toggleWarmupSet, removeSet } from "@/app/(app)/workout/[id]/actions";

export function SetRowMenu({
  setId,
  isWarmup,
}: {
  setId: string;
  isWarmup: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
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
              await toggleWarmupSet(setId, !isWarmup, new FormData());
            })
          }
        >
          <Flame className="size-4" />
          {isWarmup ? "unmark warmup" : "mark as warmup"}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() =>
            startTransition(async () => {
              await removeSet(setId, new FormData());
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
