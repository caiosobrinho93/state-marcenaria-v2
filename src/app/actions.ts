"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { admin, db, configured } from "@/lib/supabase";
import { defaults } from "@/lib/types";
const text = z.string().trim().max(8000);
const media = z
  .string()
  .max(2000)
  .refine(
    (v) => !v || v.startsWith("/images/") || /^https:\/\//.test(v),
    "Use uma URL HTTPS.",
  );
const entrySchema = z.object({
  id: z.uuid().optional(),
  kind: z.enum(["material", "project", "category", "manufacturer"]),
  title: z.string().trim().min(2).max(160),
  category: text,
  description: text,
  image: media,
  images: z.array(media).max(12),
  brand: text,
  reference: text,
  specifications: text,
  variations: text,
  availability: z.enum(["consultar", "disponivel", "indisponivel"]),
  featured: z.boolean(),
  published: z.boolean(),
  position: z.number().int().min(0).max(99999),
});
function message(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir. Tente novamente.";
}
export async function login(form: FormData) {
  try {
    const email = z.email().parse(form.get("email"));
    const password = z.string().min(8).max(128).parse(form.get("password"));
    const client = await db();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { error: "E-mail ou senha inválidos." };
    try {
      await admin();
    } catch {
      await client.auth.signOut();
      return { error: "Este usuário não possui acesso administrativo." };
    }
    return { ok: true };
  } catch {
    return {
      error: configured()
        ? "Verifique os campos informados."
        : "Supabase ainda não configurado.",
    };
  }
}
export async function logout() {
  const client = await db();
  await client.auth.signOut();
  return { ok: true };
}
export async function saveEntry(input: unknown) {
  try {
    const { client } = await admin();
    const value = entrySchema.parse(input);
    const { error } = await client.from("entries").upsert(value);
    if (error) throw new Error("Não foi possível salvar o conteúdo.");
    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { error: message(e) };
  }
}
export async function removeEntry(id: string) {
  try {
    const { client } = await admin();
    z.uuid().parse(id);
    const { error } = await client.from("entries").delete().eq("id", id);
    if (error) throw new Error("Não foi possível remover.");
    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { error: message(e) };
  }
}
export async function saveSettings(input: unknown) {
  try {
    const { client } = await admin();
    const value = z
      .object({
        heroTitle: z.string().min(5).max(200),
        heroDescription: text,
        about: text,
        whatsapp: z.string().regex(/^$|^[1-9]\d{9,14}$/),
        email: z.union([z.email(), z.literal("")]),
        address: text,
        seoTitle: z.string().min(3).max(160),
        seoDescription: z.string().max(320),
        heroImage: media,
        heroVideo: media,
        published: z.boolean(),
      })
      .parse(input);
    const { error } = await client
      .from("settings")
      .upsert({ id: 1, data: value });
    if (error) throw new Error("Erro ao salvar configurações.");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { error: message(e) };
  }
}
export async function updateProfile(form: FormData) {
  try {
    const { client } = await admin();
    const name = z.string().trim().min(2).max(100).parse(form.get("name"));
    const password = String(form.get("password") || "");
    if (password) z.string().min(12).max(128).parse(password);
    const { error } = await client.auth.updateUser({
      data: { name },
      ...(password ? { password } : {}),
    });
    if (error) throw new Error("Não foi possível atualizar o perfil.");
    return { ok: true };
  } catch (e) {
    return { error: message(e) };
  }
}
export async function upload(form: FormData) {
  try {
    const { client } = await admin();
    const file = form.get("file");
    if (
      !(file instanceof File) ||
      file.size > 3 * 1024 * 1024 ||
      file.size === 0
    )
      throw new Error("Envie uma imagem de até 3 MB.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const isJpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    const isPng =
      bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
    const isWebp =
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
    const extension = isJpeg ? "jpg" : isPng ? "png" : isWebp ? "webp" : null;
    if (
      !extension ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    )
      throw new Error("Formato permitido: JPEG, PNG ou WebP.");
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage
      .from("media")
      .upload(path, bytes, {
        contentType: `image/${extension === "jpg" ? "jpeg" : extension}`,
        upsert: false,
      });
    if (error) throw new Error("Falha no upload. Verifique o bucket media.");
    return {
      url: client.storage.from("media").getPublicUrl(path).data.publicUrl,
    };
  } catch (e) {
    return { error: message(e) };
  }
}
export async function createLead(input: unknown) {
  try {
    const value = z
      .object({
        name: z.string().trim().min(2).max(100),
        phone: z.string().regex(/^[\d\s()+-]{10,20}$/),
        email: z.union([z.email(), z.literal("")]),
        message: z.string().trim().min(10).max(2000),
        materials: z.array(z.uuid()).max(30),
        consent: z.literal(true),
        website: z.literal(""),
      })
      .parse(input);
    const client = await db();
    const { data, error } = await client.rpc("submit_lead", {
      p_name: value.name,
      p_phone: value.phone,
      p_email: value.email,
      p_message: value.message,
      p_materials: value.materials,
    });
    if (error || !data)
      throw new Error(
        "Não foi possível registrar. Tente novamente em alguns minutos ou fale pelo WhatsApp.",
      );
    return { ok: true };
  } catch (e) {
    return { error: message(e) };
  }
}
export async function updateLead(id: string, status: string, note: string) {
  try {
    const { client } = await admin();
    z.uuid().parse(id);
    z.enum([
      "novo",
      "em_atendimento",
      "proposta",
      "concluido",
      "arquivado",
    ]).parse(status);
    z.string().max(2000).parse(note);
    const { error } = await client.rpc("update_lead", {
      p_id: id,
      p_status: status,
      p_note: note,
    });
    if (error) throw new Error("Erro ao atualizar solicitação.");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { error: message(e) };
  }
}
export async function getDefaultSettings() {
  await admin();
  return defaults;
}
