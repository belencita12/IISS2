import Link from 'next/link'; 
import { headers } from 'next/headers'; 
import { AlertTriangle } from 'lucide-react'; 

async function getSiteData() {
  const headersList = await headers();
  const domain = headersList.get('host') || 'Sitio desconocido';
  return { name: domain };
}

export default async function NotFound() {
  const data = await getSiteData();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 text-center p-6">
      <div className="bg-white p-12 rounded-lg shadow-xl max-w-4xl w-full mt-6">
        <AlertTriangle className="text-red-600 h-24 w-24 mx-auto mt-4" /> 
        <h1 className="text-9xl font-extrabold text-red-600">404</h1>
        <h3 className="text-4xl mt-4 font-medium text-gray-800">Página no encontrada</h3>
        <p className="mt-6 text-xl text-gray-700">
          Lo sentimos, no pudimos encontrar el recurso solicitado en <strong>{data.name}</strong>.
        </p>
        <p className="mt-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold text-xl">
            Regresa a la página de inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
