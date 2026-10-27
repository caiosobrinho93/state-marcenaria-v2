"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions";
export default function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <main className="setup">
      <Link className="brand" href="/">
        state<span>MARCENARIA</span>
      </Link>
      <h1 style={{ marginTop: 40 }}>Bem-vindo de volta.</h1>
      <p>Entre com sua conta administrativa.</p>
      <form
        className="login-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const result = await login(new FormData(e.currentTarget));
            if (result.error) setError(result.error);
            else router.refresh();
          } catch {
            setError("Falha de conexão. Tente novamente.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          E-mail
          <input type="email" name="email" autoComplete="username" required />
        </label>
        <label>
          Senha
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            minLength={8}
            required
          />
        </label>
        <button className="button gold" disabled={busy}>
          {busy ? "Entrando…" : "Entrar"}
        </button>
        <p role="alert">{error}</p>
      </form>
      <p>
        Precisa recuperar o acesso? Solicite ao responsável pelo projeto um
        convite ou redefinição pelo Supabase Auth.
      </p>
      <Link href="/">← Voltar ao site</Link>
    </main>
  );
}
