import { Header } from '@/components/admin/Header'
import { LineChart, PieChart, BarChart } from '@/components/admin/Charts';
import { DollarSign, Users } from 'lucide-react';

export default function Dashboard() {


  return (
    <div className="text-sm sm:text-base flex flex-col gap-3">
      <Header fullName="Jorge Oviedo" />
      <div className="flex md:flex-row flex-col items-center w-full gap-3">
        <div className="bg-white w-full md:flex-1 p-4 shadow rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-sm text-gray-500">Total Facturado</h3>
            <p className="text-2xl font-bold">$10,000</p>
          </div>
          <DollarSign size={32} className="text-green-500" />
        </div>
        <div className="bg-white w-full md:flex-1 p-4 shadow rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-sm text-gray-500">Clientes</h3>
            <p className="text-2xl font-bold">150</p>
          </div>
          <Users size={32} className="text-blue-500" />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex flex-col flex-1 gap-3">
          <LineChart />
          <BarChart />
        </div>
        <div className="flex-1">
          <PieChart />
        </div>
      </div>


    </div>

  );
}
