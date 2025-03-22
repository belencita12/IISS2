import { ConfigurationList } from "@/lib/admin/configuration/ConfigurationList";

export default function SettingsPage() {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Configuración</h1>
        <ConfigurationList />
      </div>
    );
  }