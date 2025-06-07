import { INVOICE_API } from "../urls";

export async function getInvoiceDetailReport(
  id: string,
  token: string
): Promise<Blob | { message: string }> {
  try {
    const res = await fetch(`${INVOICE_API}/${id}/pdf`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return { message: error.message || "Error al generar el reporte" };
    }

    return await res.blob();
  } catch (error) {
    return { message: "Error de conexión al generar el reporte" };
  }
}
