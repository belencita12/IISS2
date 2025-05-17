"use client";

import { useState } from "react";
import Head from "next/head";
import { Search, CircleHelpIcon, X } from "lucide-react";
import ClientAppointmentHelp from "./ClientApoimentHelp";
import InventoryHelp from "./InventoryHelp";
import FinancialHelp from "./FinancialHelp";
import DashboardHelp from "./DashboardHelp";

export default function HelpData() {
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
        <title>Centro de Ayuda | Sistema Veterinario</title>
        <meta
          name="description"
          content="Centro de ayuda para el sistema de veterinaria"
        />
      </Head>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CircleHelpIcon className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Centro de Ayuda</h1>
          <p className="text-gray-600">
            Encuentra respuestas a preguntas comunes sobre el sistema de
            veterinaria
          </p>
        </div>

        <div className="flex mb-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar ayuda..."
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
                title="Borrar búsqueda"
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
            Buscar
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
            Dashboard
          </button>
          <button
            onClick={() => setActiveSection("clientes")}
            className={`flex-1 text-center py-2 rounded-lg text-sm transition font-medium ${
              searchTerm === "" && activeSection === "clientes"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            Clientes y Citas
          </button>
          <button
            onClick={() => setActiveSection("inventario")}
            className={`flex-1 text-center py-2 rounded-lg text-sm transition font-medium ${
              searchTerm === "" && activeSection === "inventario"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            Inventario
          </button>
          <button
            onClick={() => setActiveSection("finanzas")}
            className={`flex-1 text-center py-2 rounded-lg text-sm transition font-medium ${
              searchTerm === "" && activeSection === "finanzas"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            Finanzas
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
