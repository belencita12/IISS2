import { useState, useEffect } from 'react';
import { DollarSign, Users } from 'lucide-react'; // Importa los iconos de lucide-react
//import { toast } from 'react-toastify'; // Importa toast desde react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Asegúrate de importar los estilos

interface DashboardStat {
  totalFacturado: number;
  clientes: number;
}

export const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardStat | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hacer una solicitud a la API para obtener los datos
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard-stats'); // Cambia esta URL por la de tu API
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data: DashboardStat = await response.json();
        setStats(data);
        toast.success('Datos cargados exitosamente!'); // Muestra un toast de éxito cuando los datos se cargan correctamente
      } catch (error) {
        setError('No se pudieron cargar los datos');
        toast.error('Error al cargar los datos'); // Muestra un toast de error si ocurre un problema
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-sm text-gray-500">Total Facturado</h3>
            <p className="text-2xl font-bold">${stats?.totalFacturado.toLocaleString()}</p>
          </div>
          <DollarSign size={32} className="text-green-500" />
        </div>
        <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-sm text-gray-500">Clientes</h3>
            <p className="text-2xl font-bold">{stats?.clientes}</p>
          </div>
          <Users size={32} className="text-blue-500" />
        </div>
      </div>

      {/* Toast Container */}
      <toast.Container position="top-right" autoClose={3000} hideProgressBar newestOnTop />
    </>
  );
};
