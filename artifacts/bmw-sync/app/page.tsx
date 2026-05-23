import { redirect } from "next/navigation";

export default async function HomePage() {
  let user = null;

  try {
    const { createServerSupabaseClient } = await import(
      "@/lib/supabase-server"
    );
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    redirect("/setup");
  }

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
