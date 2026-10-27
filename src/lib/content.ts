import { db, configured } from "./supabase";
import { defaults, type Entry, type Settings } from "./types";
export async function content() {
  if (!configured())
    return { entries: [] as Entry[], settings: defaults, unavailable: false };
  const client = await db();
  const [a, b] = await Promise.all([
    client.from("entries").select("*").eq("published", true).order("position"),
    client.from("settings").select("data").eq("id", 1).maybeSingle(),
  ]);
  return {
    entries: (a.data || []) as Entry[],
    settings: { ...defaults, ...b.data?.data } as Settings,
    unavailable: Boolean(a.error || b.error),
  };
}
