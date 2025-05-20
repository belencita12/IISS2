"use client";

import type { IUserProfile } from "@/lib/client/IUserProfile";
import { Mail, Phone, MapPin, FileText } from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

export default function ClientProfileSection({
    fullName,
    image,
    ruc,
    email,
    phoneNumber,
    adress,
}: IUserProfile) {
    const u= useTranslations("ProfileUser")

    return (
        <Card className="mb-8 mt-8 shadow-md w-full">
            <CardHeader className="pb-0">
                <h1 className="text-3xl font-bold tracking-tight">
                    {u("title")}
                </h1>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                    <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-background shadow-lg flex-shrink-0">
                        <Image
                            src={image?.originalUrl || "/default-avatar.png"}
                            alt={fullName}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                        <div>
                            <h2 className="text-2xl font-bold">{fullName}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-muted-foreground">
                                        {u("rucLabel")}
                                    </p>
                                    <p className="font-medium truncate">
                                        {ruc}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-muted-foreground">
                                        {u("emailLabel")}
                                    </p>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <p className="font-medium truncate">
                                                    {email}
                                                </p>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{email}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-muted-foreground">
                                        {u("phoneLabel")}
                                    </p>
                                    <p className="font-medium truncate">
                                        {phoneNumber}
                                    </p>
                                </div>
                            </div>

                            {adress && (
                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-muted-foreground">
                                            {u("addressLabel")}
                                        </p>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <p className="font-medium truncate">
                                                        {adress}
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{adress}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
