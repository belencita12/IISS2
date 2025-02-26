'use client'
// pages/auth/login.tsx
import { signIn } from "next-auth/react";
import { useState } from "react";
import authOptions from "../../lib/auth/options";

interface LoginPageProps {
  session: any;
}

export default function LoginPage({ session }: LoginPageProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      console.log("Login success:", result);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h1>Iniciar Sesión</h1>
      {session ? (
        <div>
          <p>
            Sesión iniciada como <strong>{session.user.username}</strong>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="email">Username:</label>
            <input
              id="email"
              name="email"
              type="text"
              placeholder="jsmith"
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit">Entrar</button>
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </form>
      )}
    </div>
  );
}



