import { SettingsList } from "@/components/admin/settings/SettingsList";

export default function SettingsPage() {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Configuración</h1>
        <SettingsList />
      </div>
    );
  }