import Link from "next/link";

const settingsOptions = [
  {
    name: "Razas",
    description:
      "Listar, crear, editar o eliminar las razas soportadas por el sistema.",
    icon: "🐶",
    link: "/dashboard/settings/races",
  },
  {
    name: "Especies",
    description: "Gestionar las especies disponibles en el sistema.",
    icon: "🐾",
    link: "/dashboard/settings/species",
  },
  {
    name: "Puestos",
    description: "Administrar los puestos soportados en la veterinaria.",
    icon: "🏥",
    link: "/dashboard/settings/positions",
  },
  {
    name: "Proveedores",
    description: "Administrar los proveedores de productos y servicios.",
    icon: "🏥",
    link: "/dashboard/settings/providers",
  },
  {
    name: "Tags",
    description:
      "Administra las etiquetas que soporta el sistema para un mejor filtrado y busqueda de productos.",
    icon: "🏷️",
    link: "/dashboard/settings/tags",
  },
  {
    name: "Historial de Vacunación",
    description: "Gestionar y revisar los registros de vacunación de las mascotas.",
    icon: "💉",
    link: "/dashboard/settings/vaccine-registry/new",
  },
  {
    name: "Tipo de servicio",
    description: "Administrar los diferentes tipos de servicios disponibles en la veterinaria.",
    icon: "🛁",
    link: "/dashboard/settings/service-types",
  },
];

export function SettingsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {settingsOptions.map((option) => (
        <Link href={option.link} key={option.name}>
          <div className="h-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 text-3xl">
                {option.icon}
              </div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
                {option.name}
              </h2>
              <p className="text-sm text-gray-600 text-center line-clamp-2">
                {option.description}
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="text-sm text-emerald-600 text-center font-medium hover:text-emerald-700 transition-colors duration-200">
                Configurar
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
