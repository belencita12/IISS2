import Link from "next/link";
import { getTranslations } from "next-intl/server";

const t = await getTranslations()
;
const settingsOptions = [
  
  {
    name: t("settings.races.name"),
    description:
      t("settings.races.description"),
    icon: t("settings.races.icon"),
    link: "/dashboard/settings/races",
  },
  {
    name: t("settings.species.name"),
    description: t("settings.species.description"),
    icon: t("settings.species.icon"),
    link: "/dashboard/settings/species",
  },
  {
    name: t("settings.position.name"),
    description: t("settings.position.description"),
    icon: t("settings.position.icon"),
    link: "/dashboard/settings/positions",
  },
  {
    name: t("settings.providers.name"),
    description: t("settings.providers.description"),
    icon: t("settings.providers.icon"),
    link: "/dashboard/settings/providers",
  },
  {
    name: t("settings.tags.name"),
    description: t("settings.tags.description"),
    icon: t("settings.tags.icon"),
    link: "/dashboard/settings/tags",
  },
  {
    name: t("settings.vaccineRegistry.name"),
    description: t("settings.vaccineRegistry.description"),
    icon: t("settings.vaccineRegistry.icon"),
    link: "/dashboard/settings/vaccine-registry",
  },
  {
    name: t("settings.serviceTypes.name"),
    description: t("settings.serviceTypes.description"),
    icon: t("settings.serviceTypes.icon"),
    link: "/dashboard/settings/service-types",
  },
  {
    name: t("settings.pets.name"),
    description: t("settings.pets.description"),
    icon: t("settings.pets.icon"),
    link: "/dashboard/settings/pets",
  },
  {
    name: t("settings.receipts.name"),
    description: t("settings.receipts.description"),
    icon: t("settings.receipts.icon"),
    link: "/dashboard/settings/receipts",
  },
  {
    name: t("settings.stamping.name"),
    description: t("settings.stamping.description"),
    icon: t("settings.stamping.icon"),
    link: "/dashboard/settings/stamped",
  }  
];

export function SettingsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {settingsOptions.map((option) => (
        <Link href={option.link} key={option.name}>
          <div className="h-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 flex-grow">
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
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
              <div className="text-sm text-emerald-600 text-center font-medium hover:text-emerald-700 transition-colors duration-200">
                {t("settings.configure")}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
