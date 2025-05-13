"use client";

import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactSection() {
    const t = useTranslations("ContactSection");

    return (
        <section className="mt-16 pt-8 border-t border-myPurple-disabled">
            <div className="flex flex-col md:flex-row justify-around items-center gap-6">
                <h2 className="text-2xl font-semibold text-myPurple-primary">
                    {t("contact")}
                </h2>

                <div className="space-y-4 w-full max-w-md">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-myPurple-disabled/30 to-myPink-disabled/30">
                        <div className="flex items-center gap-3">
                            <div className="bg-myPurple-primary rounded-full p-2">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium">{t("email")}</span>
                        </div>
                        <a
                            href="mailto:contacto@example.com"
                            className="text-myPink-primary hover:text-myPink-hover transition-colors font-medium hover:underline"
                        >
                            contacto@example.com
                        </a>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-myPurple-disabled/30 to-myPink-disabled/30">
                        <div className="flex items-center gap-3">
                            <div className="bg-myPink-primary rounded-full p-2">
                                <Phone className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium">{t("phone")}</span>
                        </div>
                        <a
                            href="tel:+1234567890"
                            className="text-myPurple-primary hover:text-myPurple-hover transition-colors font-medium hover:underline"
                        >
                            +123456789
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}