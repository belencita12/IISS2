import React from "react";
import Image, { StaticImageData } from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

interface ICardProps {
    title: string;
    description: string;
    image: string | StaticImageData;
    alt?: string;
    ctaText?: string;
    ctaLink?: string;
    layout?: "vertical" | "horizontal";
    imagePosition?: "top" | "bottom" | "left" | "right";
    showButton?: boolean;
    bgColor?: string;
    textColor?: string;
    tags?: string[];
}

export function Card({
    title,
    description,
    image,
    alt = "Imagen del producto",
    ctaText = "Ver más",
    ctaLink = "#",
    layout = "vertical",
    imagePosition = "top",
    showButton = true,
    bgColor = "bg-white",
    textColor = "text-gray-900",
    tags = [],
}: ICardProps) {
    const isHorizontal = layout === "horizontal";
    const showImage = !!image;

    return (
        <div
            className={`flex ${isHorizontal ? "flex-row" : "flex-col"}
                w-[260px] min-w-[260px] max-w-[260px] max-h-[350px]
                m-2 rounded-lg shadow-md hover:shadow-lg
                transition-shadow duration-300 overflow-hidden ${bgColor} ${textColor}`}
        >
            {showImage && (imagePosition === "top" || imagePosition === "left") && (
                <div className={`relative ${isHorizontal ? "w-1/3 min-h-full" : "w-full h-[180px]"}`}>
                    <Image
                        src={image}
                        alt={alt}
                        fill
                        style={{ objectFit: "cover" }}
                        className={`${isHorizontal ? "rounded-l-lg" : "rounded-t-lg"}`}
                    />
                </div>
            )}
            <div className="p-3 flex flex-col justify-between flex-1 overflow-hidden">
                <div className="flex flex-col space-y-1 overflow-hidden">
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1">
                            {tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full border border-gray-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <h3 className="text-xs font-semibold line-clamp-2 min-h-[2.5em]">{title}</h3>
                    <p className="text-sm text-gray-800 line-clamp-2 min-h-[3em]">
                        {description}
                    </p>
                </div>
                {showButton && (
                    <div className="mt-3">
                        <Button
                            asChild
                            className="w-full text-center text-sm h-8 bg-gray-900 text-white hover:bg-gray-700 rounded-md"
                        >
                            <Link href={ctaLink}>
                                {ctaText}
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
