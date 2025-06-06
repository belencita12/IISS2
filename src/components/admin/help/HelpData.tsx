"use client";

import { useState } from "react";
import Head from "next/head";
import { Search, CircleHelpIcon, X } from "lucide-react";
import ClientAppointmentHelp from "./ClientApoimentHelp";
import InventoryHelp from "./InventoryHelp";
import FinancialHelp from "./FinancialHelp";
import DashboardHelp from "./DashboardHelp";
import { useTranslations } from "next-intl";

export default function HelpData() {

  const t = useTranslations();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    setSearchTerm(inputValue.trim());
  };

  const clearSearch = () => {
    setInputValue("");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen">
      <Head>
        <title>{t("help.head.title")}</title>
        <meta
          name="description"
          content={t("help.head.description")}
        />
      </Head>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CircleHelpIcon className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t("help.data.title")}</h1>
          <p className="text-gray-600">
            {t("help.data.description")}
          </p>
        </div>

        <div className="flex mb-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t("search.searchHelp")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border rounded py-2 pl-10 pr-10 w-full"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={18} className="text-gray-400" />
            </div>
            {inputValue && (
              <button
                onClick={clearSearch}
                title={t("help.delete")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="bg-black text-white px-4 py-2 rounded ml-2"
          >
            {t("button.search")}
          </button>
        </div>

        <div className="flex w-full bg-gray-100 rounded-xl p-1 mb-8">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`flex-1 text-center py-2 rounded-lg text-sm transition font-medium ${
              searchTerm === "" && activeSection === "dashboard"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            {t("help.data.dashboard")}
          </button>
          <button
            onClick={() => setActiveSection("clientes")}
            className={`flex-1 text-center py-2 rounded-lg text-sm transition font-medium ${
              searchTerm === "" && activeSection === "clientes"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
             {t("help.data.clientsAndAppointments")}
          </button>
          <button
            onClick={() => setActiveSection("inventario")}
            className={`flex-1 text-center py-2 rounded-lg text-sm transition font-medium ${
              searchTerm === "" && activeSection === "inventario"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
             {t("help.data.inventory")}
          </button>
          <button
            onClick={() => setActiveSection("finanzas")}
            className={`flex-1 text-center py-2 rounded-lg text-sm transition font-medium ${
              searchTerm === "" && activeSection === "finanzas"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
             {t("help.data.financial")}
          </button>
        </div>

        {searchTerm ? (
          <div className="space-y-6">
            <DashboardHelp searchTerm={searchTerm} />
            <ClientAppointmentHelp searchTerm={searchTerm} />
            <InventoryHelp searchTerm={searchTerm} />
            <FinancialHelp searchTerm={searchTerm} />
          </div>
        ) : (
          <>
            {activeSection === "dashboard" && <DashboardHelp searchTerm={""} />}
            {activeSection === "clientes" && (
              <ClientAppointmentHelp searchTerm={""} />
            )}
            {activeSection === "inventario" && (
              <InventoryHelp searchTerm={""} />
            )}
            {activeSection === "finanzas" && <FinancialHelp searchTerm={""} />}
          </>
        )}
      </main>
    </div>
  );
}
