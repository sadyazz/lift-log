"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signup, type SignupFormState } from "@/app/(auth)/signup/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SignupFormState = { error: null, success: false };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);
  const [showPassword, setShowPassword] = useState(false);

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
        <Input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="next"
          className="h-11"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            enterKeyHint="done"
            className="h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "hide password" : "show password"}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full py-6 text-base">
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
