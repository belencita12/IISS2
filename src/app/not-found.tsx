import Link from 'next/link';
import { headers } from 'next/headers';

async function getSiteData() {
  const headersList = await headers();
  const domain = headersList.get('host') || 'Sitio desconocido';
  return { name: domain };
}

export default async function NotFound() {
  const data = await getSiteData();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-4xl font-bold">404 - No encontrado</h2>
      <p className="mt-2 text-gray-600">
        No se pudo encontrar el recurso solicitado en <strong>{data.name}</strong>.
      </p>
      <p className="mt-4">
        Regresa a la <Link href="/" className="text-blue-500 hover:underline">página de inicio</Link>
      </p>
    </div>
  );
}
