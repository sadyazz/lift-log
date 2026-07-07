import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-8 p-6">
      <h1 className="text-4xl font-extrabold tracking-tight">log in</h1>
      <LoginForm />
    </main>
  );
}
