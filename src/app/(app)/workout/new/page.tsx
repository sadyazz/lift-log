import { StartWorkoutPicker } from "@/components/workout/start-workout-picker";

export default function NewWorkoutPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <h1 className="text-4xl font-extrabold tracking-tight">start workout</h1>
      <StartWorkoutPicker />
    </div>
  );
}
