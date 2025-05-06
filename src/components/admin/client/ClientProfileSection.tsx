"use client";

import type { IUserProfile } from "@/lib/client/IUserProfile";
import { Mail, Phone, Calendar, MapPin, FileText } from "lucide-react";
import Image from "next/image";

export default function ClientProfileSection({
    fullName,
    image,
    ruc,
    email,
    phoneNumber,
    adress,
    createdAt,
}: IUserProfile) {
    return (
        <section className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto mt-6 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="shrink-0">
                    <Image
                        src={image?.originalUrl || "/default-avatar.png"}
                        alt={fullName}
                        width={180}
                        height={180}
                        className="w-[180px] h-[180px] rounded-full object-cover border-4 border-white shadow-md"
                    />
                </div>

                <div className="flex-1 w-full">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {fullName}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                        <div className="flex items-center gap-3 group transition-all hover:bg-gray-50 p-2 rounded-lg">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 group-hover:bg-gray-200">
                                <FileText size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">
                                    RUC
                                </p>
                                <p className="text-gray-800 font-medium">
                                    {ruc}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 group transition-all hover:bg-gray-50 p-2 rounded-lg">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 group-hover:bg-gray-200">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">
                                    Correo
                                </p>
                                <p className="text-gray-800 font-medium">
                                    {email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 group transition-all hover:bg-gray-50 p-2 rounded-lg">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 group-hover:bg-gray-200">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">
                                    Teléfono
                                </p>
                                <p className="text-gray-800 font-medium">
                                    {phoneNumber}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 group transition-all hover:bg-gray-50 p-2 rounded-lg">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 group-hover:bg-gray-200">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">
                                    Dirección
                                </p>
                                <p className="text-gray-800 font-medium">
                                    {adress}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
