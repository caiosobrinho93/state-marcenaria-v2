export type Entry = {
  id: string;
  kind: "material" | "project" | "category" | "manufacturer";
  title: string;
  category: string;
  description: string;
  image: string;
  images: string[];
  brand: string;
  reference: string;
  specifications: string;
  variations: string;
  availability: "consultar" | "disponivel" | "indisponivel";
  featured: boolean;
  published: boolean;
  position: number;
};
export type Settings = {
  heroTitle: string;
  heroDescription: string;
  about: string;
  whatsapp: string;
  email: string;
  address: string;
  seoTitle: string;
  seoDescription: string;
  heroImage: string;
  heroVideo: string;
  published: boolean;
};
export const defaults: Settings = {
  heroTitle: "Ambientes que expressam sua essência.",
  heroDescription:
    "Marcenaria autoral e móveis planejados. Da primeira ideia ao último detalhe, um espaço verdadeiramente seu.",
  about:
    "Acreditamos que um ambiente deve refletir quem vive nele. Unimos desenho, materiais e cuidado em cada acabamento para criar móveis que fazem sentido na sua rotina.",
  whatsapp: "5517997448213",
  email: "",
  address: "Votuporanga – SP",
  seoTitle: "State Marcenaria | Ambientes com essência",
  seoDescription:
    "Móveis planejados, marcenaria autoral e ambientes personalizados. Conheça a State Marcenaria.",
  heroImage: "/images/hero.webp",
  heroVideo: "",
  published: true,
};
