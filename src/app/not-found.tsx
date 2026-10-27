import Link from "next/link";
export default function NotFound() {
  return (
    <main className="setup">
      <p className="eyebrow">404 / STATE</p>
      <h1>Este espaço ainda não existe.</h1>
      <Link href="/" className="button">
        Voltar ao início ↗
      </Link>
    </main>
  );
}
