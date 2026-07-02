"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type SignupFormState } from "@/app/signup/actions";

const initialState: SignupFormState = { error: null, success: false };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  if (state.success) {
    return (
      <p className="text-sm text-gray-700">
        Check your email to confirm your account, then log in.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="rounded-md border border-gray-300 px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">password</span>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="rounded-md border border-gray-300 px-3 py-2"
        />
      </label>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {pending ? "signing up..." : "sign up"}
      </button>
      <p className="text-sm text-gray-600">
        already have an account? <Link href="/login" className="underline">log in</Link>
      </p>
    </form>
  );
}
