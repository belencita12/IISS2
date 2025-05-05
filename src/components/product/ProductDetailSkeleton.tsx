import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductDetailSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    className="flex items-center text-gray-400 pl-0 pointer-events-none"
                    disabled
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </Button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
                        <div className="relative w-full aspect-square max-w-md bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>

                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                        <div className="flex-1">
                            <div className="h-8 w-3/4 bg-gray-200 rounded-md animate-pulse mb-4"></div>

                            <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse mb-2"></div>
                            <div className="h-4 w-5/6 bg-gray-200 rounded-md animate-pulse mb-6"></div>

                            <div className="h-7 w-1/3 bg-gray-200 rounded-md animate-pulse mb-6"></div>

                            <div className="mb-6">
                                <div className="h-6 w-1/4 bg-gray-200 rounded-md animate-pulse mb-3"></div>
                                <div className="flex gap-2 flex-wrap">
                                    <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-6"></div>
                <div className="flex flex-wrap justify-center sm:justify-start -mx-2">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
                        >
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-80">
                                <div className="h-48 bg-gray-200 animate-pulse"></div>
                                <div className="p-4">
                                    <div className="h-5 w-3/4 bg-gray-200 rounded-md animate-pulse mb-3"></div>
                                    <div className="h-4 w-1/2 bg-gray-200 rounded-md animate-pulse mb-4"></div>
                                    <div className="h-8 w-full bg-gray-200 rounded-md animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
