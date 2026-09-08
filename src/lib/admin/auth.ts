import { ADMIN_USER_ID } from "@/lib/admin/config";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  if (user.id !== ADMIN_USER_ID) {
    throw new Error("Forbidden");
  }

  return user;
}