import Link from 'next/link';

const settingsOptions = [
  { name: 'Razas', description: 'Listar, crear, editar o eliminar las razas soportadas por el sistema.', icon: '🐶', link: '/dashboard/race' },
  { name: 'Especies', description: 'Gestionar las especies disponibles en el sistema.', icon: '🐾', link: '/dashboard/settings/species' },
  { name: 'Puestos', description: 'Administrar los puestos soportados en la veterinaria.', icon: '🏥', link: '/dashboard/settings/positions' },
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
