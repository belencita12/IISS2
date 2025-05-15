"use client";

import { useState } from "react";
import Head from "next/head";
import { Search } from "lucide-react";
import ClientAppointmentHelp from "./ClientApoimentHelp";
import InventoryHelp from "./InventoryHelp";
import FinancialHelp from "./FinancialHelp";
import DashboardHelp from "./DashboardHelp";
import { CircleHelpIcon } from "lucide-react";

export default function HelpData() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<string, boolean>
  >({});

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded py-2 pl-10 pr-4 w-full"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded ml-2">
            Buscar
          </button>
        </div>

        <div className="flex w-full bg-gray-100 rounded-xl p-1 mb-8">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`flex-1 text-center py-2 rounded-lg text-sm transition font-medium ${
              activeSection === "dashboard"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveSection("clientes")}
            className={`flex-1 text-center py-2 rounded-lg text-sm transition font-medium ${
              activeSection === "clientes"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            Clientes y Citas
          </button>
          <button
            onClick={() => setActiveSection("inventario")}
            className={`flex-1 text-center py-2 rounded-lg text-sm transition font-medium ${
              activeSection === "inventario"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            Inventario
          </button>
          <button
            onClick={() => setActiveSection("finanzas")}
            className={`flex-1 text-center py-2 rounded-lg text-sm transition font-medium ${
              activeSection === "finanzas"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            Finanzas
          </button>
        </div>

        {activeSection === "dashboard" && <DashboardHelp searchTerm={searchTerm} />}
        {activeSection === "clientes" && <ClientAppointmentHelp  searchTerm={searchTerm} />}
        {activeSection === "inventario" && <InventoryHelp searchTerm={searchTerm} />}
        {activeSection === "finanzas" && <FinancialHelp  searchTerm={searchTerm} />}
      </main>
    </div>
  );
}
