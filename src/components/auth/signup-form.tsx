"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type SignupFormState } from "@/app/(auth)/signup/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SignupFormState = { error: null, success: false };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  if (state.success) {
    return (
      <p className="text-sm text-muted-foreground">
        check your email to confirm your account, then log in.
      </p>
    );
  }

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
          minLength={6}
          autoComplete="new-password"
        />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="rounded-lg">
        {pending ? "signing up..." : "sign up"}
      </Button>
      <p className="text-sm text-muted-foreground">
        already have an account?{" "}
        <Link href="/login" className="underline">
          log in
        </Link>
      </p>
    </form>
  );
}
