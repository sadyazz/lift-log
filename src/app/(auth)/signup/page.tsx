import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-8 p-6">
      <h1 className="text-4xl font-extrabold tracking-tight">sign up</h1>
      <SignupForm />
    </main>
  );
}
