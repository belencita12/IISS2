import { Header } from '@/components/admin/Header'
import { LineChart, PieChart, BarChart } from '@/components/admin/Charts';
import { DollarSign, Users } from 'lucide-react';

export default function Dashboard() {


  return (
    <div>
      <Header fullName="Jorge Oviedo" />
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          {/* Total Facturado */}
        <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-sm text-gray-500">Total Facturado</h3>
            <p className="text-2xl font-bold">$10,000</p>
          </div>
          <DollarSign size={32} className="text-green-500" />
        </div>

        {/* Clientes */}
        <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-sm text-gray-500">Clientes</h3>
            <p className="text-2xl font-bold">150</p>
          </div>
          <Users size={32} className="text-blue-500" />
        </div>
        </div>
        


        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          <div className="w-full h-80">
            <LineChart />
          </div>
          <div className="w-full h-60">
            <PieChart />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          <div className="w-full h-96 mt-6">
            <BarChart />
          </div>
        </div>

      </div>

    </div>
  );
}
