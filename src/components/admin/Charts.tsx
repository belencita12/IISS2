'use client';

import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, 
         CategoryScale, 
         LinearScale, 
         BarElement, 
         Title, 
         Tooltip, 
         Legend, 
         PointElement, 
         LineElement, 
         ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, 
                 LinearScale, 
                 PointElement, 
                 LineElement, 
                 ArcElement, 
                 BarElement, 
                 Title, 
                 Tooltip, 
                 Legend);

const lineData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
  datasets: [
    {
      label: 'Citas',
      data: [10, 20, 15, 25, 30],
      borderColor: '#4F46E5',
      backgroundColor: '#4F46E5',
      tension: 0.4
    }
  ]
};

const pieData = {
  labels: ['Baño', 'Vacunas', 'Consulta', 'Peluquería'],
  datasets: [
    {
      label: 'Servicios',
      data: [12, 19, 8, 5],
      backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24']
    }
  ]
};

const barData = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
  datasets: [
    {
      label: 'Ventas',
      data: [10, 20, 15, 30, 25],
      backgroundColor: 'rgba(53, 162, 235, 0.5)'
    }
  ]
};


export const LineChart = () => (
  <div className="relative w-full p-3 aspect-video bg-white rounded-lg shadow">
    <Line
      data={lineData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true, // Muestra el título
            text: 'Gráfico de Citas', // El título que deseas
            font: {
              size: 18, // Tamaño de la fuente
              weight: 'bold', // Grosor de la fuente
            },
            color: '#333', // Color del título
          }
        }
      }}
      redraw={true}
    />
  </div>
);

export const PieChart = () => (
  <div className="relative w-full p-3 aspect-square bg-white rounded-lg shadow">
    <Pie
      data={pieData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true, // Muestra el título
            text: 'Distribución de Servicios', // El título que deseas
            font: {
              size: 18, // Tamaño de la fuente
              weight: 'bold', // Grosor de la fuente
            },
            color: '#333', // Color del título
          }
        }
      }}
      redraw={true}
    />
  </div>
);

export const BarChart = () => (
  <div className="relative w-full p-3 aspect-video bg-white rounded-lg shadow">
    <Bar
      data={barData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true, // Muestra el título
            text: 'Ventas por Mes', // El título que deseas
            font: {
              size: 18, // Tamaño de la fuente
              weight: 'bold', // Grosor de la fuente
            },
            color: '#333', // Color del título
          }
        }
      }}
      redraw={true}
    />
  </div>
);

