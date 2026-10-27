import { configured } from "@/lib/supabase";
import { content } from "@/lib/content";
import Website from "@/components/website";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const { settings } = await content();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      images: [settings.heroImage],
    },
  };
}
export default async function Page() {
  const { entries, settings, unavailable } = await content();
  if (!settings.published)
    return (
      <main className="setup">
        <h1>Estamos preparando algo especial.</h1>
        <p>State Marcenaria · Votuporanga, SP</p>
      </main>
    );
  return (
    <Website
      backendReady={configured()}
      entries={entries}
      settings={settings}
      unavailable={unavailable}
    />
  );
}
