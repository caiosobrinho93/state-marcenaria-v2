"use client";
/* Uploaded media is validated by the server; native images allow any configured Supabase host. */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  Menu,
  X,
  Plus,
  Check,
  Search,
  SlidersHorizontal,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import type { Entry, Settings } from "@/lib/types";
import { createLead } from "@/app/actions";
const environments = [
  [
    "Cozinhas planejadas",
    "Onde os encontros acontecem.",
    "Espaços que aproximam, com funcionalidade em cada escolha.",
  ],
  [
    "Dormitórios & closets",
    "O seu lugar de desacelerar.",
    "Conforto, organização e detalhes que respeitam sua rotina.",
  ],
  [
    "Salas & painéis",
    "Uma nova forma de estar.",
    "Composições que conectam materiais, proporções e personalidade.",
  ],
  [
    "Ambientes corporativos",
    "Espaço para boas ideias.",
    "Soluções que acompanham o ritmo e a identidade do seu negócio.",
  ],
  [
    "Projetos personalizados",
    "Se você imagina, vamos desenhar.",
    "Cada espaço tem possibilidades. Vamos descobrir as suas.",
  ],
];
const materialCategories = [
  "MDF e padrões",
  "Puxadores",
  "Corrediças",
  "Dobradiças",
  "Acessórios",
];
const availableLabels = {
  consultar: "Sob consulta",
  disponivel: "Disponível",
  indisponivel: "Indisponível",
};
export default function Website({
  entries,
  settings,
  unavailable,
  backendReady,
}: {
  entries: Entry[];
  settings: Settings;
  unavailable: boolean;
  backendReady: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState(0);
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [portfolioCategory, setPortfolioCategory] = useState("Todos");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<Entry | null>(null);
  const [result, setResult] = useState("");
  const [pending, setPending] = useState(false);
  const materials = entries.filter((x) => x.kind === "material");
  const projects = entries.filter((x) => x.kind === "project");
  const selectedItems = materials.filter((x) => selected.includes(x.id));
  const whatsapp = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Olá, State! Gostaria de conversar sobre um projeto de marcenaria." + (selectedItems.length ? "\nMateriais de interesse:\n" + selectedItems.map((x) => `${x.title}${x.reference ? " (" + x.reference + ")" : ""}`).join("\n") : ""))}`;
  useEffect(() => {
    let cleanup = () => {};
    let disposed = false;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const connection = (
      navigator as Navigator & { connection?: { saveData: boolean } }
    ).connection;
    if (reduced || connection?.saveData || window.innerWidth < 900) return;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        mm.add("(min-width: 900px)", () => {
          const ctx = gsap.context(() => {
            gsap.to(".hero-visual", {
              yPercent: 15,
              ease: "none",
              scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
            gsap.fromTo(
              ".story-image",
              { scale: 1.08 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: ".story",
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
          }, root);
          return () => ctx.revert();
        });
        cleanup = () => mm.revert();
      },
    );
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);
  useEffect(() => {
    if (detail) dialog.current?.showModal();
    else dialog.current?.close();
  }, [detail]);
  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : current.length < 30
          ? [...current, id]
          : current,
    );
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setResult("");
    try {
      const response = await createLead({
        name: data.get("name"),
        phone: data.get("phone"),
        email: data.get("email"),
        message: data.get("message"),
        materials: selected,
        consent: data.get("consent") === "on",
        website: data.get("website"),
      });
      setResult(
        response.error ||
          "Solicitação registrada. Obrigado! Você também pode continuar a conversa pelo WhatsApp.",
      );
      if (response.ok) form.reset();
    } catch {
      setResult("Falha de conexão. Tente novamente ou use o WhatsApp.");
    } finally {
      setPending(false);
    }
  }
  return (
    <div ref={root}>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <a className="brand" href="#" aria-label="stateMARCENARIA, início">
          state<span>MARCENARIA</span>
        </a>
        <nav className={menu ? "nav open" : "nav"} aria-label="Principal">
          {[
            ["Ambientes", "ambientes"],
            ["Nossa essência", "essencia"],
            ["Materiais", "materiais"],
            ["Portfólio", "portfolio"],
          ].map(([label, id]) => (
            <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#contato">
          Vamos criar juntos <ArrowUpRight size={17} />
        </a>
        <button
          className="menu-toggle icon-button"
          aria-label={menu ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main id="conteudo">
        <section className="hero">
          <div className="hero-visual">
            {settings.heroImage.startsWith("/images/") ? (
              <Image
                src={settings.heroImage}
                alt="Ambiente com marcenaria em madeira natural e tons claros"
                fill
                priority
                sizes="100vw"
                quality={85}
              />
            ) : (
              <img
                src={settings.heroImage}
                alt="Ambiente com marcenaria planejada"
                fetchPriority="high"
              />
            )}
          </div>
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">
              <span className="gold-line" /> FEITO PARA SER SEU
            </p>
            <h1>{settings.heroTitle}</h1>
            <p className="hero-description">{settings.heroDescription}</p>
            <a className="button gold" href="#contato">
              Conte sua ideia <ArrowUpRight size={19} />
            </a>
          </div>
          <div className="hero-bottom">
            <a href="#ambientes">
              <ArrowDown size={17} /> Explore as possibilidades
            </a>
            <span>DESIGN QUE ACOLHE. DETALHES QUE FICAM.</span>
            <span className="slide-count">
              01 <i>/</i> 05
            </span>
          </div>
        </section>
        <div className="values-strip">
          <span>Design autoral</span>
          <i />
          <span>Feito sob medida</span>
          <i />
          <span>Materiais selecionados</span>
          <i />
          <span>Cuidado em cada detalhe</span>
        </div>
        <section className="section story" id="ambientes">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / POSSIBILIDADES</p>
              <h2>
                Seu jeito de viver.
                <br />
                <em>Em cada ambiente.</em>
              </h2>
            </div>
            <p>
              Do primeiro café ao descanso no fim do dia.
              <br />
              Marcenaria pensada para fazer parte da sua vida.
            </p>
          </div>
          <div
            className="environment-tabs"
            role="tablist"
            aria-label="Ambientes"
          >
            {environments.map(([name], i) => (
              <button
                role="tab"
                aria-selected={active === i}
                aria-controls="environment-panel"
                id={`environment-tab-${i}`}
                tabIndex={active === i ? 0 : -1}
                onKeyDown={(e) => {
                  if (
                    ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                  ) {
                    e.preventDefault();
                    const next =
                      e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? 4
                          : (active + (e.key === "ArrowRight" ? 1 : 4)) % 5;
                    setActive(next);
                    document.getElementById(`environment-tab-${next}`)?.focus();
                  }
                }}
                className={active === i ? "active" : ""}
                key={name}
                onClick={() => setActive(i)}
              >
                <span>0{i + 1}</span>
                {name}
              </button>
            ))}
          </div>
          <div
            className="environment-scene"
            id="environment-panel"
            role="tabpanel"
            aria-labelledby={`environment-tab-${active}`}
          >
            <Image
              className="story-image"
              src={
                active === 0
                  ? "/images/hero.webp"
                  : active === 1
                    ? "/images/detail.webp"
                    : "/images/space.webp"
              }
              alt="Referência visual de interiores e marcenaria"
              fill
              sizes="(max-width: 768px) 100vw, 90vw"
            />
            <div className="scene-shade" />
            <div className="scene-copy" key={active}>
              <p className="eyebrow">{environments[active][0]}</p>
              <h3>{environments[active][1]}</h3>
              <p>{environments[active][2]}</p>
              <a href="#contato">
                Vamos pensar no seu espaço <ArrowUpRight size={18} />
              </a>
            </div>
            <span className="image-caption">
              IMAGEM CONCEITUAL · REFERÊNCIA DE AMBIENTAÇÃO
            </span>
          </div>
        </section>
        <section className="about section" id="essencia">
          <div className="about-image">
            <Image
              src="/images/detail.webp"
              alt="Detalhes de acabamento em ambiente conceitual"
              fill
              sizes="(max-width:768px) 100vw, 45vw"
            />
            <span className="image-caption">O DETALHE MUDA TUDO.</span>
          </div>
          <div className="about-copy">
            <p className="eyebrow">02 / NOSSA ESSÊNCIA</p>
            <h2>
              Mais do que móveis.
              <br />
              <em>Um jeito de pertencer.</em>
            </h2>
            <p>{settings.about}</p>
            <div className="principles">
              {[
                [
                  "01",
                  "Pensado para você",
                  "Personalização que começa na escuta.",
                ],
                [
                  "02",
                  "Beleza que faz sentido",
                  "Materiais, acabamento e aproveitamento inteligente.",
                ],
                [
                  "03",
                  "Cuidado do início ao fim",
                  "Atenção aos detalhes e compromisso em cada etapa.",
                ],
              ].map(([n, t, d]) => (
                <div key={n}>
                  <span>{n}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="materials section" id="materiais">
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 / ESCOLHAS QUE TRANSFORMAM</p>
              <h2>
                Materiais <em>& Acabamentos.</em>
              </h2>
            </div>
            <p>
              Texturas para sentir. Detalhes para escolher.
              <br />
              Encontre o que combina com o seu projeto.
            </p>
          </div>
          <div className="catalog-tools">
            <div className="search-field">
              <Search size={18} />
              <input
                aria-label="Buscar materiais"
                placeholder="Busque por material, marca ou referência"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span>
              <SlidersHorizontal size={16} /> {materials.length} materiais
            </span>
          </div>
          <div className="filter-row" aria-label="Categorias de materiais">
            {[
              "Todos",
              ...new Set([
                ...materialCategories,
                ...materials.map((x) => x.category),
              ]),
            ].map((c) => (
              <button
                aria-pressed={category === c}
                key={c}
                className={category === c ? "active" : ""}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="catalog-grid">
            {materials
              .filter(
                (x) =>
                  (category === "Todos" || x.category === category) &&
                  `${x.title} ${x.brand} ${x.reference}`
                    .toLocaleLowerCase("pt-BR")
                    .includes(search.toLocaleLowerCase("pt-BR")),
              )
              .map((item) => (
                <article className="material-card" key={item.id}>
                  <button
                    className="material-photo"
                    onClick={() => setDetail(item)}
                    aria-label={`Ver ${item.title}`}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.title} loading="lazy" />
                    ) : (
                      <span className="texture-placeholder">
                        {item.category}
                      </span>
                    )}
                    {item.featured && (
                      <span className="badge">SELEÇÃO STATE</span>
                    )}
                  </button>
                  <div className="card-info">
                    <p className="eyebrow">
                      {item.category} {item.brand && " / " + item.brand}
                    </p>
                    <h3>
                      <button
                        className="text-button"
                        onClick={() => setDetail(item)}
                      >
                        {item.title}
                      </button>
                    </h3>
                    <div className="card-bottom">
                      <span>{availableLabels[item.availability]}</span>
                      <button
                        className="icon-button"
                        aria-label={`${selected.includes(item.id) ? "Remover" : "Selecionar"} ${item.title}`}
                        aria-pressed={selected.includes(item.id)}
                        onClick={() => toggle(item.id)}
                      >
                        {selected.includes(item.id) ? (
                          <Check size={18} />
                        ) : (
                          <Plus size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
          </div>
          {!materials.some(
            (x) =>
              (category === "Todos" || x.category === category) &&
              `${x.title} ${x.brand} ${x.reference}`
                .toLowerCase()
                .includes(search.toLowerCase()),
          ) && (
            <div className="empty-state">
              <span className="sample-lines">≋</span>
              <h3>
                {materials.length
                  ? "Nenhum material encontrado."
                  : "Sua escolha começa com uma conversa."}
              </h3>
              <p>
                {materials.length
                  ? "Experimente outra busca ou categoria."
                  : "Estamos preparando nosso catálogo. Consulte materiais, acabamentos e disponibilidade diretamente com a equipe."}
              </p>
              <a href={whatsapp} target="_blank" rel="noreferrer">
                Consultar materiais <ArrowUpRight size={18} />
              </a>
            </div>
          )}
          <div className="catalog-note">
            <span>
              As tonalidades podem variar conforme a tela. Confirme as amostras
              e a disponibilidade com nossa equipe.
            </span>
            <a href="#contato">
              Minha seleção ({selected.length}) <ChevronRight size={16} />
            </a>
          </div>
        </section>
        <section className="section portfolio" id="portfolio">
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 / CADA ESPAÇO, UMA HISTÓRIA</p>
              <h2>
                Ideias que ganham <em>forma.</em>
              </h2>
            </div>
            <a href="#contato" className="underlined">
              Seu projeto começa aqui <ArrowUpRight size={18} />
            </a>
          </div>
          {projects.length > 0 ? (
            <>
              <div className="filter-row">
                {["Todos", ...new Set(projects.map((x) => x.category))].map(
                  (c) => (
                    <button
                      key={c}
                      aria-pressed={portfolioCategory === c}
                      className={portfolioCategory === c ? "active" : ""}
                      onClick={() => setPortfolioCategory(c)}
                    >
                      {c}
                    </button>
                  ),
                )}
              </div>
              <div className="portfolio-grid">
                {projects
                  .filter(
                    (x) =>
                      portfolioCategory === "Todos" ||
                      x.category === portfolioCategory,
                  )
                  .map((p) => (
                    <button
                      className="project-card"
                      key={p.id}
                      onClick={() => setDetail(p)}
                    >
                      {p.image && (
                        <img src={p.image} alt={p.title} loading="lazy" />
                      )}
                      <span>
                        {p.category}
                        <strong>{p.title} ↗</strong>
                      </span>
                    </button>
                  ))}
              </div>
            </>
          ) : (
            <div className="portfolio-placeholder">
              <Image
                src="/images/space.webp"
                alt="Referência conceitual de marcenaria integrada"
                fill
                sizes="90vw"
              />
              <div>
                <span className="eyebrow">
                  INSPIRAÇÃO PARA O SEU PRÓXIMO ESPAÇO
                </span>
                <h3>Uma casa. Infinitas possibilidades.</h3>
                <p>
                  Portfólio de projetos em preparação.
                  <br />
                  Esta imagem é uma referência visual, não um projeto executado.
                </p>
              </div>
            </div>
          )}
        </section>
        {settings.heroVideo && (
          <section className="section">
            <h2>Um olhar sobre os ambientes.</h2>
            <video
              controls
              preload="none"
              poster={settings.heroImage}
              src={settings.heroVideo}
              aria-label="Vídeo de apresentação dos ambientes"
            />
          </section>
        )}
        <section className="contact section" id="contato">
          <div>
            <p className="eyebrow">05 / VAMOS CRIAR JUNTOS</p>
            <h2>
              Seu próximo espaço
              <br />
              começa com <em>uma ideia.</em>
            </h2>
            <p>
              Conte o que você imagina.
              <br />
              Vamos descobrir as possibilidades, juntos.
            </p>
            <a
              href={whatsapp}
              className="button gold"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={19} /> Conversar pelo WhatsApp{" "}
              <ArrowUpRight size={18} />
            </a>
            <p className="contact-location">
              {settings.address}
              <br />
              {settings.email && (
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              )}
            </p>
          </div>
          <form onSubmit={submit} className="contact-form">
            <h3>Vamos conhecer o seu projeto?</h3>
            {!backendReady && (
              <p className="notice">
                O formulário está em preparação. Por enquanto, envie sua ideia
                pelo WhatsApp ao lado.
              </p>
            )}
            <label>
              Seu nome
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                placeholder="Como podemos chamar você?"
              />
            </label>
            <div className="form-grid">
              <label>
                WhatsApp
                <input
                  name="phone"
                  type="tel"
                  required
                  minLength={10}
                  maxLength={20}
                  autoComplete="tel"
                  placeholder="(17) 99999-9999"
                />
              </label>
              <label>
                E-mail (opcional)
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@email.com"
                />
              </label>
            </div>
            <label>
              Sua ideia
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={2000}
                rows={3}
                placeholder="Qual ambiente você quer transformar?"
              />
            </label>
            <label className="honeypot" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            {selectedItems.length > 0 && (
              <div className="selection">
                {selectedItems.map((x) => (
                  <button type="button" key={x.id} onClick={() => toggle(x.id)}>
                    {x.title} <X size={14} />
                  </button>
                ))}
              </div>
            )}
            <label className="checkbox">
              <input type="checkbox" name="consent" required />
              Autorizo o uso dos meus dados para responder a esta solicitação.
            </label>
            <button
              className="button submit"
              disabled={pending || !backendReady}
            >
              {pending ? "Enviando…" : "Enviar solicitação"}
              <ArrowUpRight size={18} />
            </button>
            <p className="form-disclosure">
              Seus dados serão usados apenas para atender este contato. Para
              solicitar exclusão, fale conosco pelo WhatsApp.
            </p>
            <p role="status">{result}</p>
            {unavailable && (
              <p role="alert">
                Catálogo temporariamente indisponível. Fale conosco pelo
                WhatsApp.
              </p>
            )}
          </form>
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <a className="brand" href="#">
            state<span>MARCENARIA</span>
          </a>
          <p>
            Espaços com identidade.
            <br />
            Detalhes com propósito.
          </p>
          <a href="#contato">
            Vamos conversar <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} State Marcenaria</span>
          <span>{settings.address}</span>
          <a href="/admin">Área administrativa</a>
        </div>
      </footer>
      <dialog
        ref={dialog}
        onCancel={() => setDetail(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setDetail(null);
        }}
        className="detail-dialog"
      >
        {detail && (
          <>
            <button
              className="dialog-close icon-button"
              onClick={() => setDetail(null)}
              aria-label="Fechar detalhes"
            >
              <X />
            </button>
            {detail.image && <img src={detail.image} alt={detail.title} />}
            <div className="detail-copy">
              <p className="eyebrow">
                {detail.category} / {detail.brand}
              </p>
              <h2>{detail.title}</h2>
              <p>{detail.description}</p>
              {detail.kind === "material" && (
                <>
                  <dl>
                    {[
                      ["Referência", detail.reference],
                      ["Especificações", detail.specifications],
                      ["Variações", detail.variations],
                      ["Disponibilidade", availableLabels[detail.availability]],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v || "Consulte a equipe"}</dd>
                      </div>
                    ))}
                  </dl>
                  <button
                    className="button gold"
                    onClick={() => toggle(detail.id)}
                  >
                    {selected.includes(detail.id)
                      ? "Remover da seleção"
                      : "Adicionar à seleção"}
                    <Plus size={18} />
                  </button>
                </>
              )}
              {detail.images.map((url, i) => (
                <img
                  key={url + i}
                  src={url}
                  alt={`${detail.title}, detalhe ${i + 1}`}
                  loading="lazy"
                />
              ))}
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
