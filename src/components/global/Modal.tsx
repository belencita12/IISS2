// src/components/Modal.tsx

import React, { useEffect } from 'react'

interface IModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeOnBackdropClick?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdropClick = true,
}: IModalProps) {
  // Efecto para detectar la tecla Escape y cerrar el modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Si el modal no está abierto, no se renderiza nada
  if (!isOpen) return null

  // Determinamos las clases de Tailwind según el tamaño
  let sizeClasses = ''
  switch (size) {
    case 'sm':
      sizeClasses = 'max-w-sm'
      break
    case 'lg':
      sizeClasses = 'max-w-lg'
      break
    default:
      sizeClasses = 'max-w-md'
  }

  // Función para manejar el clic en el backdrop
  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`bg-white rounded p-6 ${sizeClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
