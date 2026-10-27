import Link from "next/link";
import { admin, configured } from "@/lib/supabase";
import { defaults } from "@/lib/types";
import AdminPanel from "@/components/admin-panel";
import Login from "@/components/login";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Administração | State",
  robots: { index: false, follow: false },
};
export default async function Page() {
  if (!configured())
    return (
      <main className="setup">
        <Link className="brand" href="/">
          state<span>MARCENARIA</span>
        </Link>
        <h1 style={{ marginTop: 40 }}>Seu painel começa aqui.</h1>
        <p>
          O acesso administrativo será ativado após conectar o Supabase. Nenhuma
          operação está sendo simulada.
        </p>
        <ol>
          <li>
            Crie o projeto Supabase e execute{" "}
            <code>supabase/migrations/001_initial.sql</code>.
          </li>
          <li>
            Configure as variáveis de <code>.env.example</code>.
          </li>
          <li>
            Crie seu usuário no Supabase Auth e adicione seu ID à tabela{" "}
            <code>admins</code>.
          </li>
        </ol>
        <Link href="/" className="button gold">
          Voltar ao site ↗
        </Link>
      </main>
    );
  let session;
  try {
    session = await admin();
  } catch {
    return <Login />;
  }
  const { client, user } = session;
  const [entries, settings, leads, history] = await Promise.all([
    client.from("entries").select("*").order("position"),
    client.from("settings").select("data").eq("id", 1).maybeSingle(),
    client
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200),
    client
      .from("lead_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500),
  ]);
  if (entries.error || settings.error || leads.error || history.error)
    return (
      <main className="setup">
        <h1>Não foi possível carregar o painel.</h1>
        <p>
          Verifique a conexão e se a migração SQL foi aplicada. Atualize a
          página para tentar novamente.
        </p>
      </main>
    );
  return (
    <AdminPanel
      entries={entries.data || []}
      settings={{ ...defaults, ...settings.data?.data }}
      leads={leads.data || []}
      history={history.data || []}
      email={user.email || ""}
      name={user.user_metadata.name || ""}
    />
  );
}
