'use client';

import { Mail, Phone } from 'lucide-react';
import { useTranslations } from "next-intl";

export default function ContactSection() {
  const t = useTranslations("ContactSection");
  return (
    <section className="mt-2 border-t pt-10 gap-3 sm:gap-0 flex justify-between items-center">
      {/* Título a la izquierda */}
      <h2 className="sm:text-2xl font-semibold flex-1 text-center text-sm"> {t("contact")}</h2>

      {/* Datos de contacto a la derecha */}
      <div className=" space-y-3 flex flex-col gap-2 sm:gap-5 flex-1 items-start">
        <div className="flex sm:justify-between sm:items-center items-start sm:gap-4 flex-col sm:flex-row text-xs sm:text-sm w-full">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>{t("email")}</span>
          </div>
          <a href="mailto:contacto@example.com" className="text-blue-600 hover:underline">
            contacto@example.com
          </a>
        </div>
        <div className="flex sm:justify-between sm:items-center items-start sm:gap-4 flex-col sm:flex-row text-xs sm:text-sm w-full">
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5" />
            <span>{t("phone")}</span>
          </div>
          <a href="tel:+1234567890" className="text-blue-600 hover:underline">
            +123456789
          </a>
        </div>
      </div>
    </section>
  );
}

