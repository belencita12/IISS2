"use client";

import Image from "next/image";
import { Heart, Users, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

export default function About() {
    const t = useTranslations("about");

    return (
        <div className="flex flex-col min-h-screen">
            <div className="w-full bg-gradient-to-r from-myPurple-tertiary to-myPink-tertiary py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {t("aboutUs")}
                </h1>
                <div className="w-20 h-1 bg-white mx-auto my-6"></div>
                <p className="text-white text-lg max-w-2xl mx-auto px-4">
                    {t("subtitle")}
                </p>
            </div>

            <div className="container mx-auto py-16 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex justify-center">
                        <Image
                            src="/image.png"
                            alt="NicoPets Logo"
                            width={500}
                            height={500}
                            className="object-contain"
                        />
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-myPurple-primary">
                            {t("weAre")}
                        </h2>

                        <p className="text-gray-700">{t("description1")}</p>
                        <p className="text-gray-700">{t("description2")}</p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 bg-myPurple-disabled/30 text-myPurple-primary px-4 py-2 rounded-full">
                                <Heart className="w-5 h-5" />
                                <span>{t("personalizedCare")}</span>
                            </div>

                            <div className="flex items-center gap-2 bg-myPink-disabled/30 text-myPink-primary px-4 py-2 rounded-full">
                                <Users className="w-5 h-5" />
                                <span>{t("professionalTeam")}</span>
                            </div>

                            <div className="flex items-center gap-2 bg-myPurple-disabled/30 text-myPurple-primary px-4 py-2 rounded-full">
                                <Clock className="w-5 h-5" />
                                <span>{t("emergencyService")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <h2 className="text-2xl font-semibold text-myPurple-primary mb-6">
                        {t("ourServices")}
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            "vaccination",
                            "medications",
                            "hygiene",
                            "grooming",
                            "checkup",
                            "products",
                            "emergency",
                            "daycare",
                            "online",
                        ].map((key) => (
                            <li key={key} className="space-y-2">
                                <h3 className="text-lg font-bold text-myPink-primary">
                                    {t(`services.${key}Title`)}
                                </h3>
                                <p className="text-gray-700 before:content-['•'] before:mr-2 before:text-myPink-primary before:inline-block">
                                    {t(`services.${key}Desc`)}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
