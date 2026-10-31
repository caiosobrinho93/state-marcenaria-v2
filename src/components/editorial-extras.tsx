"use client";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Pause,
  Play,
  Quote,
  Ruler,
  Layers,
  Sparkles,
  MessagesSquare,
  PencilRuler,
  Hammer,
} from "lucide-react";
import type { Entry } from "@/lib/types";

export function EndlessRibbon() {
  const [paused, setPaused] = useState(false);
  const words = [
    "Design que se sente",
    "Detalhes que ficam",
    "Feito para você",
    "Da ideia à matéria",
  ];
  return (
    <section
      className="endless-ribbon"
      aria-label="Design que se sente. Detalhes que ficam. Feito para você. Da ideia à matéria."
    >
      <div className={"ribbon-window " + (paused ? "is-paused" : "")}>
        <div className="ribbon-track" aria-hidden="true">
          {[0, 1].map((copy) => (
            <div className="ribbon-copy" key={copy}>
              {words.map((word) => (
                <span key={word}>
                  {word}
                  <i>✳</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        className="ribbon-control"
        aria-label={
          paused ? "Reproduzir faixa animada" : "Pausar faixa animada"
        }
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </section>
  );
}

export function SpaceCards() {
  const cards = [
    {
      name: "Cozinhas",
      subtitle: "O coração da casa.",
      image: "/images/hero.webp",
      tag: "ENCONTRO",
      position: "25% center",
    },
    {
      name: "Closets",
      subtitle: "Tudo no seu lugar.",
      image: "/images/space.webp",
      tag: "INTIMIDADE",
      position: "center",
    },
    {
      name: "Detalhes",
      subtitle: "O essencial está aqui.",
      image: "/images/detail.webp",
      tag: "PERSONALIDADE",
      position: "75% center",
    },
  ];
  return (
    <div className="space-cards">
      {cards.map((card, i) => (
        <a className="space-card" href="#contato" key={card.name}>
          <div className="space-photo">
            <Image
              src={card.image}
              alt={`Referência conceitual de ${card.name.toLowerCase()}`}
              fill
              sizes="(max-width: 767px) 85vw, 30vw"
              style={{ objectPosition: card.position }}
            />
            <span className="space-tag">{card.tag}</span>
            <span className="space-index">0{i + 1}</span>
          </div>
          <div className="space-info">
            <div>
              <h3>{card.name}</h3>
              <p>{card.subtitle}</p>
            </div>
            <span className="space-arrow">
              <ArrowUpRight size={23} />
            </span>
          </div>
          <span className="space-caption">
            REFERÊNCIA VISUAL · SOB MEDIDA PARA VOCÊ
          </span>
        </a>
      ))}
    </div>
  );
}

export function SignatureCards() {
  const cards = [
    {
      icon: Ruler,
      title: "Cada centímetro importa.",
      text: "Aproveitamento inteligente, proporções equilibradas e soluções que respeitam o seu espaço.",
      tag: "PRECISÃO",
    },
    {
      icon: Layers,
      title: "Você vê. Você sente.",
      text: "Texturas, materiais e acabamentos que conversam entre si. A beleza também mora no toque.",
      tag: "MATÉRIA",
    },
    {
      icon: Sparkles,
      title: "A sua identidade, presente.",
      text: "Escolhas que traduzem o seu jeito de viver, sem deixar a funcionalidade em segundo plano.",
      tag: "ESSÊNCIA",
    },
  ];
  return (
    <section
      className="signature-section section"
      aria-labelledby="signature-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">O QUE TORNA UM ESPAÇO SEU</p>
          <h2 id="signature-title">
            A diferença mora
            <br />
            <em>nos detalhes.</em>
          </h2>
        </div>
        <p>
          Não é excesso. É intenção.
          <br />
          Do desenho ao acabamento.
        </p>
      </div>
      <div className="signature-grid">
        {cards.map(({ icon: Icon, title, text, tag }) => (
          <article className="signature-card" key={tag}>
            <div className="signature-top">
              <Icon size={27} strokeWidth={1} />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
            <span className="signature-stroke" aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProcessCards() {
  const steps = [
    {
      icon: MessagesSquare,
      title: "Uma boa conversa.",
      text: "Conte sua ideia, sua rotina e o que você espera do ambiente.",
    },
    {
      icon: PencilRuler,
      title: "Ideias no papel.",
      text: "Explore possibilidades de desenho, materiais e aproveitamento do espaço.",
    },
    {
      icon: Hammer,
      title: "Forma e presença.",
      text: "Alinhe os detalhes de execução, montagem e entrega com a nossa equipe.",
    },
  ];
  return (
    <section className="process-section section" id="processo">
      <div className="process-intro">
        <p className="eyebrow">DO PRIMEIRO OLÁ AO SEU NOVO ESPAÇO</p>
        <h2>
          Um projeto.
          <br />
          <em>Construído juntos.</em>
        </h2>
        <a href="#contato" className="process-link">
          Começar uma conversa <ArrowUpRight size={19} />
        </a>
      </div>
      <div className="process-cards">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <article className="process-card" key={title}>
            <div className="process-step">
              <span>0{i + 1}</span>
              <Icon size={22} strokeWidth={1.2} />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
            {i < 2 && (
              <ArrowRight
                className="process-next"
                size={17}
                aria-hidden="true"
              />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function Testimonials({
  entries,
  phone,
}: {
  entries: Entry[];
  phone: string;
}) {
  const [activeReview, setActiveReview] = useState(0);
  const reviews = entries.filter(
    (e) => e.kind === "testimonial" && e.published && e.description.trim(),
  );
  const href = `https://wa.me/${phone}?text=${encodeURIComponent("Olá, State! Sou cliente e gostaria de compartilhar minha experiência e conversar sobre a publicação do meu depoimento.")}`;
  return (
    <section className="testimonials-section section" id="depoimentos">
      <div className="section-heading">
        <div>
          <p className="eyebrow">DEPOIMENTOS / QUEM VIVE O ESPAÇO</p>
          <h2>
            Depois da entrega,
            <br />
            <em>a história continua.</em>
          </h2>
        </div>
        <p>
          Um ambiente ganha sentido
          <br />
          quando passa a fazer parte da vida.
        </p>
      </div>
      {reviews.length ? (
        <>
        <div className="testimonial-grid testimonial-carousel" aria-live="polite">
          {reviews.map((review, index) => (
            <figure className={`testimonial-card ${index === activeReview ? "is-active" : ""}`} key={review.id}>
              <Quote size={34} strokeWidth={1} />
              <blockquote>{review.description}</blockquote>
              <figcaption>
                <span className="review-avatar" aria-hidden="true">
                  {review.title.slice(0, 1)}
                </span>
                <div>
                  <strong>{review.title}</strong>
                  <span>{review.category}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        {reviews.length > 1 && (
          <div className="testimonial-dots" aria-label="Selecionar depoimento">
            {reviews.map((review, index) => (
              <button
                key={review.id}
                type="button"
                className={index === activeReview ? "is-active" : ""}
                aria-label={`Mostrar depoimento ${index + 1}`}
                aria-pressed={index === activeReview}
                onClick={() => setActiveReview(index)}
              />
            ))}
          </div>
        )}
        </>
      ) : (
        <div className="review-invitation">
          <div className="review-symbol" aria-hidden="true">
            <Quote size={90} strokeWidth={0.6} />
            <span>
              HISTÓRIAS REAIS.
              <br />
              ESPAÇOS VIVIDOS.
            </span>
          </div>
          <div>
            <span className="review-pending">DEPOIMENTOS EM BREVE</span>
            <h3>
              O próximo capítulo
              <br />
              pode ser <em>o seu.</em>
            </h3>
            <p>
              Este espaço é reservado a relatos reais de clientes, publicados
              com autorização. Já criou um ambiente com a State? Queremos
              conhecer sua experiência.
            </p>
            <a href={href} target="_blank" rel="noreferrer">
              Compartilhar minha experiência <ArrowUpRight size={20} />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
