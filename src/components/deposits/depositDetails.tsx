import { useState, useEffect } from "react";

interface Deposito {
  id: number;
  nombre: string;
  ubicacion: string;
}

interface DepositoDetalle {
  id: number;
  producto_id: number;
  deposito_id: number;
  cantidad: number;
}

interface Product {
  id: number;
  nombre: string;
}

interface Props {
  depositoId: number;
}

const DepositDetails: React.FC<Props> = ({ depositoId }) => {
  const [deposito, setDeposito] = useState<Deposito | null>(null);
  const [detalles, setDetalles] = useState<DepositoDetalle[]>([]);
  const [productos, setProductos] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Cargar datos del depósito
    fetch(`/api/depositos/${depositoId}`)
      .then((res) => res.json())
      .then(setDeposito);

    // Cargar detalles del depósito
    fetch(`/api/deposito_detalle?depositoId=${depositoId}`)
      .then((res) => res.json())
      .then(setDetalles);

    // Cargar productos
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data: Product[]) => {
        const productMap: { [key: number]: string } = {};
        data.forEach((product) => {
          productMap[product.id] = product.nombre;
        });
        setProductos(productMap);
      });
  }, [depositoId]);

  const totalPages = Math.ceil(detalles.length / itemsPerPage);
  const paginatedDetails = detalles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      {deposito && (
        <h2 className="text-xl font-bold mb-4">
          Depósito: {deposito.nombre} ({deposito.ubicacion})
        </h2>
      )}
      <ul className="divide-y divide-gray-200">
        {paginatedDetails.map((detalle) => (
          <li key={detalle.id} className="p-2 flex justify-between">
            <span>{productos[detalle.producto_id] || "Cargando..."}</span>
            <span className="font-semibold">Cantidad: {detalle.cantidad}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default DepositDetails;
