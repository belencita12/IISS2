// app/server-session-test/page.tsx
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth/options";

export default async function ServerSessionTestPage() {
  // Obtén la sesión del lado del servidor sin necesidad de pasar req/res
  const session = await getServerSession(authOptions);
  console.log("Server session:", session);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
      <h1>Prueba de Sesión del Lado del Servidor</h1>
      {session ? (
        <div>
          <p>
            Usuario: <strong>{session.user.username}</strong>
          </p>
          <p>
            Roles: <strong>{session.user.roles.join(", ")}</strong>
          </p>
        </div>
      ) : (
        <p>No se encontró sesión.</p>
      )}
    </div>
  );
}
