"use client";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Entry, Settings } from "@/lib/types";
import {
  saveEntry,
  removeEntry,
  saveSettings,
  upload,
  logout,
  updateLead,
  updateProfile,
} from "@/app/actions";
type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  materials: { id: string; title: string; reference: string }[];
  status: string;
  created_at: string;
};
type History = {
  id: string;
  lead_id: string;
  status: string;
  note: string;
  created_at: string;
};
const tabs = [
  "Visão geral",
  "Materiais",
  "Portfólio",
  "Categorias",
  "Fabricantes",
  "Solicitações",
  "Website",
  "Perfil",
];
const kinds: Record<string, Entry["kind"]> = {
  Materiais: "material",
  Portfólio: "project",
  Categorias: "category",
  Fabricantes: "manufacturer",
};
const empty = (kind: Entry["kind"]): Omit<Entry, "id"> & { id?: string } => ({
  kind,
  title: "",
  category: "",
  description: "",
  image: "",
  images: [],
  brand: "",
  reference: "",
  specifications: "",
  variations: "",
  availability: "consultar",
  featured: false,
  published: false,
  position: 0,
});
const date = (v: string) =>
  new Date(v).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
export default function AdminPanel({
  entries,
  settings,
  leads,
  history,
  email,
  name,
}: {
  entries: Entry[];
  settings: Settings;
  leads: Lead[];
  history: History[];
  email: string;
  name: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState(tabs[0]);
  const [editing, setEditing] = useState<ReturnType<typeof empty> | null>(null);
  const [config, setConfig] = useState(settings);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [leadStatus, setLeadStatus] = useState("todos");
  async function run(fn: () => Promise<{ error?: string; ok?: boolean }>) {
    setBusy(true);
    setNotice("");
    try {
      const result = await fn();
      if (result.error) {
        setNotice(result.error);
        return false;
      }
      setNotice("Alterações salvas.");
      router.refresh();
      return true;
    } catch {
      setNotice("Falha de conexão. Tente novamente.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  function field(key: keyof ReturnType<typeof empty>, value: unknown) {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : null));
  }
  async function uploadFile(file: File | undefined, append = false) {
    if (!file) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const result = await upload(form);
      if (result.error) setNotice(result.error);
      else if (result.url) {
        if (append)
          setEditing((prev) =>
            prev ? { ...prev, images: [...prev.images, result.url!] } : prev,
          );
        else field("image", result.url);
      }
    } catch {
      setNotice("Falha no upload.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand" href="/">
          state<span>MARCENARIA</span>
        </Link>
        <nav aria-label="Administração">
          {tabs.map((t) => (
            <button
              key={t}
              className={tab === t ? "active" : ""}
              onClick={() => {
                setTab(t);
                setEditing(null);
                setNotice("");
                setQuery("");
              }}
            >
              {t}
            </button>
          ))}
        </nav>
        <a href="/" target="_blank" rel="noreferrer">
          Abrir website ↗
        </a>
      </aside>
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <p className="eyebrow">STATE / ADMINISTRAÇÃO</p>
            <h1>{tab}</h1>
            <p>{email}</p>
          </div>
          <button
            className="button"
            disabled={busy}
            onClick={async () => {
              await run(logout);
              router.refresh();
            }}
          >
            Sair
          </button>
        </div>
        {notice && (
          <p className="notice" role="status">
            {notice}
          </p>
        )}
        {tab === "Visão geral" && (
          <>
            <div className="stats">
              {[
                ["Solicitações (últimas 200)", leads.length],
                [
                  "Projetos",
                  entries.filter((e) => e.kind === "project").length,
                ],
                [
                  "Materiais",
                  entries.filter((e) => e.kind === "material").length,
                ],
              ].map(([label, value]) => (
                <div className="stat" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <h2 style={{ fontSize: 26 }}>Atividade recente dos atendimentos</h2>
            {history.length === 0 ? (
              <p>Nenhum atendimento registrado.</p>
            ) : (
              history.slice(0, 12).map((h) => (
                <div className="activity" key={h.id}>
                  <strong>
                    {leads.find((l) => l.id === h.lead_id)?.name ||
                      "Solicitação"}{" "}
                    · {h.status.replaceAll("_", " ")}
                  </strong>
                  <p>{h.note}</p>
                  <small>{date(h.created_at)}</small>
                </div>
              ))
            )}
            <p className="notice">
              Disponibilidade só deve ser marcada como disponível após
              confirmação. Conteúdos em rascunho não aparecem no site.
            </p>
          </>
        )}
        {kinds[tab] && (
          <>
            <div className="catalog-tools">
              <input
                aria-label="Buscar conteúdo"
                placeholder="Buscar por título"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="button gold"
                disabled={busy}
                onClick={() => setEditing(empty(kinds[tab]))}
              >
                + Adicionar
              </button>
            </div>
            {editing && (
              <form
                className="admin-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (await run(() => saveEntry(editing))) setEditing(null);
                }}
              >
                <h2>
                  {editing.id ? "Editar" : "Novo"} {tab.toLowerCase()}
                </h2>
                <div className="form-grid">
                  <label>
                    Título
                    <input
                      value={editing.title}
                      required
                      minLength={2}
                      maxLength={160}
                      onChange={(e) => field("title", e.target.value)}
                    />
                  </label>
                  <label>
                    Categoria
                    <input
                      list="categories"
                      value={editing.category}
                      onChange={(e) => field("category", e.target.value)}
                    />
                    <datalist id="categories">
                      {[
                        "MDF e padrões",
                        "Puxadores",
                        "Corrediças",
                        "Dobradiças",
                        "Acessórios",
                        ...entries
                          .filter((e) => e.kind === "category")
                          .map((e) => e.title),
                      ].map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </label>
                </div>
                <label>
                  Descrição
                  <textarea
                    value={editing.description}
                    maxLength={8000}
                    onChange={(e) => field("description", e.target.value)}
                  />
                </label>
                {["material", "project"].includes(editing.kind) && (
                  <>
                    <label>
                      Foto principal (URL HTTPS ou /images/...)
                      <input
                        value={editing.image}
                        onChange={(e) => field("image", e.target.value)}
                      />
                    </label>
                    <label>
                      Enviar foto principal · JPEG, PNG, WebP · até 3 MB
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={busy}
                        onChange={(e) => uploadFile(e.target.files?.[0])}
                      />
                    </label>
                    {editing.image && (
                      <img
                        className="upload-preview"
                        src={editing.image}
                        alt="Prévia do conteúdo"
                      />
                    )}
                    <label>
                      Adicionar à galeria (até 12 fotos)
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={busy || editing.images.length >= 12}
                        onChange={(e) => uploadFile(e.target.files?.[0], true)}
                      />
                    </label>
                    <label>
                      Galeria: uma URL HTTPS por linha
                      <textarea
                        value={editing.images.join("\n")}
                        onChange={(e) =>
                          field(
                            "images",
                            e.target.value.split("\n").filter(Boolean),
                          )
                        }
                      />
                    </label>
                  </>
                )}
                {editing.kind === "material" && (
                  <>
                    <div className="form-grid">
                      <label>
                        Fabricante
                        <input
                          list="brands"
                          value={editing.brand}
                          onChange={(e) => field("brand", e.target.value)}
                        />
                        <datalist id="brands">
                          {entries
                            .filter((e) => e.kind === "manufacturer")
                            .map((e) => (
                              <option key={e.id} value={e.title} />
                            ))}
                        </datalist>
                      </label>
                      <label>
                        Código / referência
                        <input
                          value={editing.reference}
                          onChange={(e) => field("reference", e.target.value)}
                        />
                      </label>
                    </div>
                    <label>
                      Especificações (inclua espessuras e acabamento)
                      <textarea
                        value={editing.specifications}
                        onChange={(e) =>
                          field("specifications", e.target.value)
                        }
                      />
                    </label>
                    <label>
                      Variações disponíveis
                      <textarea
                        value={editing.variations}
                        onChange={(e) => field("variations", e.target.value)}
                      />
                    </label>
                    <label>
                      Disponibilidade
                      <select
                        value={editing.availability}
                        onChange={(e) => field("availability", e.target.value)}
                      >
                        <option value="consultar">Sob consulta</option>
                        <option value="disponivel">
                          Disponível — confirmado
                        </option>
                        <option value="indisponivel">Indisponível</option>
                      </select>
                    </label>
                  </>
                )}
                <label>
                  Ordem de exibição
                  <input
                    type="number"
                    min={0}
                    max={99999}
                    value={editing.position}
                    required
                    onChange={(e) => field("position", Number(e.target.value))}
                  />
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) => field("featured", e.target.checked)}
                  />
                  Destacar
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) => field("published", e.target.checked)}
                  />
                  Publicado no site
                </label>
                <button className="button gold" disabled={busy}>
                  {busy ? "Salvando…" : "Salvar conteúdo"}
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </button>
              </form>
            )}
            <div className="admin-list">
              {entries
                .filter(
                  (e) =>
                    e.kind === kinds[tab] &&
                    e.title.toLowerCase().includes(query.toLowerCase()),
                )
                .map((entry) => (
                  <div className="admin-row" key={entry.id}>
                    <div>
                      <h3>{entry.title}</h3>
                      <p>
                        {entry.category} ·{" "}
                        {entry.published ? "Publicado" : "Rascunho"} · Ordem{" "}
                        {entry.position}
                      </p>
                    </div>
                    <div className="row-actions">
                      <button disabled={busy} onClick={() => setEditing(entry)}>
                        Editar
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => {
                          if (
                            confirm(
                              `Remover "${entry.title}"? Esta ação exclui o cadastro. As imagens permanecem no Storage.`,
                            )
                          )
                            void run(() => removeEntry(entry.id));
                        }}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            {!entries.some((e) => e.kind === kinds[tab]) && (
              <p>Nenhum cadastro. Adicione o primeiro conteúdo.</p>
            )}
          </>
        )}
        {tab === "Solicitações" && (
          <>
            <div className="form-grid">
              <label>
                Buscar contato
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nome, telefone ou e-mail"
                />
              </label>
              <label>
                Status
                <select
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value)}
                >
                  {[
                    "todos",
                    "novo",
                    "em_atendimento",
                    "proposta",
                    "concluido",
                    "arquivado",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p>
              Exibindo até 200 solicitações mais recentes. Horários de Brasília.
            </p>
            {leads
              .filter(
                (l) =>
                  (leadStatus === "todos" || l.status === leadStatus) &&
                  `${l.name} ${l.phone} ${l.email}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
              )
              .map((lead) => (
                <details className="admin-lead" key={lead.id}>
                  <summary>
                    {lead.name} · {lead.status.replaceAll("_", " ")} ·{" "}
                    {date(lead.created_at)}
                  </summary>
                  <p>
                    <a href={`tel:${lead.phone}`}>{lead.phone}</a> ·{" "}
                    <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  </p>
                  <p>{lead.message}</p>
                  <h3>Materiais selecionados</h3>
                  <ul>
                    {lead.materials.map((m) => (
                      <li key={m.id}>
                        {m.title} {m.reference}
                      </li>
                    ))}
                  </ul>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const data = new FormData(e.currentTarget);
                      void run(() =>
                        updateLead(
                          lead.id,
                          String(data.get("status")),
                          String(data.get("note")),
                        ),
                      );
                    }}
                  >
                    <label>
                      Status
                      <select name="status" defaultValue={lead.status}>
                        {[
                          "novo",
                          "em_atendimento",
                          "proposta",
                          "concluido",
                          "arquivado",
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Nota de atendimento
                      <textarea name="note" maxLength={2000} />
                    </label>
                    <button className="button gold" disabled={busy}>
                      Registrar atualização
                    </button>
                  </form>
                  <h3 style={{ marginTop: 25 }}>Histórico</h3>
                  {history
                    .filter((h) => h.lead_id === lead.id)
                    .map((h) => (
                      <div className="activity" key={h.id}>
                        {h.status.replaceAll("_", " ")} · {h.note}
                        <br />
                        <small>{date(h.created_at)}</small>
                      </div>
                    ))}
                </details>
              ))}
            {!leads.length && <p>Nenhuma solicitação recebida.</p>}
          </>
        )}
        {tab === "Website" && (
          <form
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault();
              void run(() => saveSettings(config));
            }}
          >
            {(
              [
                ["heroTitle", "Título principal"],
                ["heroDescription", "Descrição principal"],
                ["about", "Sobre a marcenaria"],
                ["whatsapp", "WhatsApp (país + DDD + número, apenas dígitos)"],
                ["email", "E-mail comercial"],
                ["address", "Localização"],
                ["heroImage", "Imagem principal (URL)"],
                ["heroVideo", "Vídeo opcional (URL HTTPS)"],
                ["seoTitle", "Título SEO"],
                ["seoDescription", "Descrição SEO"],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                {label}
                {["about", "heroDescription", "seoDescription"].includes(
                  key,
                ) ? (
                  <textarea
                    value={config[key]}
                    onChange={(e) =>
                      setConfig({ ...config, [key]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    value={config[key]}
                    onChange={(e) =>
                      setConfig({ ...config, [key]: e.target.value })
                    }
                  />
                )}
              </label>
            ))}
            <label>
              Enviar imagem principal
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={busy}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBusy(true);
                  try {
                    const data = new FormData();
                    data.set("file", file);
                    const result = await upload(data);
                    if (result.url)
                      setConfig({ ...config, heroImage: result.url });
                    else setNotice(result.error || "Erro no upload.");
                  } catch {
                    setNotice("Falha de conexão.");
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={config.published}
                onChange={(e) =>
                  setConfig({ ...config, published: e.target.checked })
                }
              />
              Website publicado (desmarque para exibir página de preparação)
            </label>
            <button className="button gold" disabled={busy}>
              Salvar website
            </button>
          </form>
        )}
        {tab === "Perfil" && (
          <form
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              void run(() => updateProfile(data));
            }}
          >
            <label>
              Nome administrativo
              <input
                name="name"
                defaultValue={name}
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
              />
            </label>
            <label>
              E-mail
              <input value={email} readOnly />
            </label>
            <label>
              Nova senha (opcional, pelo menos 12 caracteres)
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
              />
            </label>
            <button className="button gold" disabled={busy}>
              Atualizar perfil
            </button>
            <p>Deixe a senha em branco para manter a atual.</p>
          </form>
        )}
      </main>
    </div>
  );
}

