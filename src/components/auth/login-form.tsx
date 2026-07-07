"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthFormState } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthFormState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">email</Label>
        <Input id="email" type="email" name="email" required autoComplete="email" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
        />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="rounded-lg">
        {pending ? "logging in..." : "log in"}
      </Button>
      <p className="text-sm text-muted-foreground">
        no account?{" "}
        <Link href="/signup" className="underline">
          sign up
        </Link>
      </p>
    </form>
  );
}
