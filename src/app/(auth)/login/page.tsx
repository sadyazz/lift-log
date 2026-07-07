import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-4xl">🏋️‍♀️</span>
        <h1 className="text-3xl font-extrabold tracking-tight">welcome back</h1>
        <p className="text-sm text-muted-foreground">log in to keep track of your lifts</p>
      </div>
      <Card className="rounded-2xl p-6 sm:p-8">
        <LoginForm />
      </Card>
    </main>
  );
}
