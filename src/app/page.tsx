import { logout } from "@/app/logout/actions";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-xl font-bold">You&apos;re logged in</h1>
      <form action={logout}>
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 font-medium text-white"
        >
          Log out
        </button>
      </form>
    </main>
  );
}
