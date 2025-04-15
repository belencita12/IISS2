"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Invoice, InvoiceDetail, InvoiceDetailResponse } from "@/lib/invoices/IInvoice";
import { getInvoiceById } from "@/lib/invoices/getInvoiceById";
import { getInvoiceDetail } from "@/lib/invoices/getInvoiceDetail";
import { getInvoiceDetailsById } from "@/lib/invoices/getInvoiceDetailById";

interface Props {
  token: string;
}

export default function InvoiceDetailComponent({ token }: Props) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  
  // Extracción del ID - forma correcta para App Router
  const invoiceId = params?.id;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalItems, setTotalItems] = useState(0); // Añadido este estado

  useEffect(() => {
    console.log("ID obtenido de params:", invoiceId); // Para depuración
  
    const fetchData = async () => {
      setLoading(true);
      setError("");
      
      try {
        if (!invoiceId || typeof invoiceId !== "string") {
          throw new Error("ID de factura inválido");
        }
      
        // Paso 1: Obtener la factura por ID
        const invoiceData = await getInvoiceById(invoiceId, token);
        setInvoice(invoiceData);
        
        // Paso 2: Usar el invoiceNumber para obtener los detalles
        const detailsResponse = await getInvoiceDetail(invoiceData.invoiceNumber, token);
        setInvoiceDetails(detailsResponse.data);
        setTotalItems(detailsResponse.total);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
        console.error("Error al cargar factura:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    if (invoiceId) {
      fetchData();
    }
  }, [invoiceId, token]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg">Cargando factura...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            onClick={() => window.location.reload()}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="fill-current h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M14.66 15.66A8 8 0 1 1 17 10h-2a6 6 0 1 0-1.76 4.24l1.42 1.42zM12 10h8l-4 4-4-4z"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded" role="alert">
          <p>No se encontró la factura solicitada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Factura #{invoice.invoiceNumber}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600"><strong>Cliente:</strong> {invoice.clientName}</p>
            <p className="text-gray-600"><strong>RUC:</strong> {invoice.ruc}</p>
          </div>
          <div>
            <p className="text-gray-600"><strong>Timbrado:</strong> {invoice.stamped}</p>
            <p className="text-gray-600"><strong>Fecha de emisión:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-lg font-semibold text-blue-800">
            <strong>Total:</strong> {new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG' }).format(invoice.total)}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Detalles de la Factura</h3>
        
        {invoiceDetails.length === 0 ? (
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-gray-600">No hay detalles asociados a esta factura</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-600">
                Mostrando <span className="font-semibold">{invoiceDetails.length}</span> de <span className="font-semibold">{totalItems}</span> items
              </p>
            </div>
            
            <div className="space-y-4">
              {invoiceDetails.map((detail) => (
                <div key={detail.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <p><strong>Cantidad:</strong> {detail.quantity}</p>
                    <p><strong>Costo Unitario:</strong> {new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG' }).format(detail.unitCost)}</p>
                    <p><strong>Monto Parcial:</strong> {new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG' }).format(detail.partialAmount)}</p>
                    <p><strong>IVA Parcial:</strong> {new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG' }).format(detail.partialAmountVAT)}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <h4 className="font-semibold text-lg mb-2">Producto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>Nombre:</strong> {detail.product.name}</p>
                        <p><strong>Código:</strong> {detail.product.code}</p>
                        <p><strong>Categoría:</strong> {detail.product.category}</p>
                      </div>
                      <div>
                        <p><strong>Precio:</strong> {new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG' }).format(detail.product.price)}</p>
                        {detail.product.iva && <p><strong>IVA:</strong> {detail.product.iva * 100}%</p>}
                      </div>
                    </div>
                    
                    {detail.product.image?.originalUrl && (
                      <div className="mt-3">
                        <img
                          src={detail.product.image.originalUrl}
                          alt={detail.product.name}
                          className="max-w-xs rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}