import React from 'react'
import { Modal } from './Modal'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  size?: 'sm' | 'md' | 'lg'
  closeOnBackdropClick?: boolean
  variant?: 'danger' | 'warning' | 'info' | 'success'
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  size = 'md',
  closeOnBackdropClick = true,
  variant = 'danger', // Por defecto danger (rojo, eliminar)
}) => {
  // Definir colores por variante
  const variantColors: Record<
    string,
    { bg: string; hover: string; text: string; iconBg: string }
  > = {
    danger: {
      bg: 'bg-red-600',
      hover: 'hover:bg-red-700',
      text: 'text-red-600',
      iconBg: 'bg-red-100',
    },
    warning: {
      bg: 'bg-yellow-500',
      hover: 'hover:bg-yellow-600',
      text: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
    },
    info: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    success: {
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
      text: 'text-green-600',
      iconBg: 'bg-green-100',
    },
  }

  const colors = variantColors[variant]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      closeOnBackdropClick={closeOnBackdropClick}
    >
      <div className="space-y-4">
        {/* Contenedor ícono + texto centrados */}
        <div className="flex items-center justify-center gap-x-3">
          {/* Icono */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colors.iconBg}`}>
            <span className={`text-2xl ${colors.text}`}>!</span>
          </div>
          {/* Texto descriptivo */}
          <p className="text-gray-700">{message}</p>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-4 py-2 rounded text-white ${colors.bg} ${colors.hover} transition`}
          >
            {confirmText}
          </button>
        </div>
      </div>

    </Modal>
  )
}
