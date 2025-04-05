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
];

export function SettingsList() {
  return (
    <div className="flex flex-wrap gap-4">
      {settingsOptions.map((option) => (
        <Link href={option.link} key={option.name}>
          <div className="w-64 p-4 bg-white shadow-md rounded-lg hover:shadow-lg hover:bg-gray-100 transition duration-300 cursor-pointer">
            <div className="text-2xl">{option.icon}</div>
            <h2 className="text-lg font-semibold mt-2">{option.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{option.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
