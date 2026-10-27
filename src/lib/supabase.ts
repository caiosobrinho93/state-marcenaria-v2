import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export const configured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
export async function db() {
  if (!configured())
    throw new Error("Configure o Supabase para ativar esta operação.");
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (items) => {
          try {
            items.forEach(({ name, value, options }) =>
              jar.set(name, value, options),
            );
          } catch {
            /* Server component: cookies refreshed by proxy. */
          }
        },
      },
    },
  );
}
export async function admin() {
  const client = await db();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) throw new Error("Autenticação necessária.");
  const { data } = await client
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (!data) throw new Error("Acesso administrativo necessário.");
  return { client, user };
}
