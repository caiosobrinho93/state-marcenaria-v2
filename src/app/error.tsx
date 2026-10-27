"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="setup">
      <h1>Não foi possível carregar este espaço.</h1>
      <p>Tente novamente em instantes.</p>
      <button onClick={reset}>Tentar novamente</button>
    </main>
  );
}
