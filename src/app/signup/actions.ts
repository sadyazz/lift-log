"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignupFormState = {
    error: string | null;
    success: boolean;
};

export async function signup(
    _prevState: SignupFormState,
    formData: FormData
): Promise<SignupFormState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        return { error: error.message, success: false};
    }

    if (data.session) {
        redirect("/");
    }

    return { error: null, success: true};
}