import { XCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "warning" | "error";

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

const toastStyles = {
    success: "bg-green-100 border-green-500 text-green-800",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
    error: "bg-red-100 border-red-500 text-red-800",
};

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
};

export default function Toast({ message, type, onClose }: ToastProps) {
    return (
        <div
            className={cn(
                "flex items-center border-l-4 p-4 rounded-lg shadow-md max-w-sm w-full",
                toastStyles[type]
            )}
        >
            {icons[type]}
            <span className="ml-2 font-medium flex-1">{message}</span>
            <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-800">
                ✖
            </button>
        </div>
    );
}

