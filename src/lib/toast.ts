import { toast as sonnerToast } from "sonner";

// Configuración base común para todos los toasts
const toastOptions = {
    duration: 3000,
    position: "top-center" as const,
    closeButton: true,
};

// Función reutilizable para mostrar toasts
export const toast = (type: 'success' | 'error' | 'info' | 'warning', message: string, options?: object) => {
    const colors: Record<string, string> = {
        success: 'green',
        error: 'red',
        info: 'blue',
        warning: 'orange',
    };

    sonnerToast[type](message, {
        ...toastOptions,
        style: {
            color: colors[type],
            fontSize: '1.25rem',
            padding: '0.75rem 1.25rem',
        },
        ...options,
    });
};