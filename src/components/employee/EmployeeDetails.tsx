import Image from "next/image";

interface Historial {
    tipo: string;
    fecha: string;
    hora: string;
    cliente: string;
    animal: string;
    detalles: { concepto: string; costo: string }[];
    total: string;
  }
 
  interface Trabajador {
    id: string;
    nombre: string;
    puesto: string;
    correo: string;
    telefono: string;
    inicioTrabajo: string;
    disponibilidad: string;
    salario: string;
    foto: string;
    historial: Historial[];
  }
 
  const EmployeeDetails = ({ trabajador }: { trabajador: Trabajador }) => {
    return (
        <div className="p-6 h-full">
        <div className=" p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-6 rounded-sm space-y-4 p-2">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Nombre completo: {trabajador.nombre}</h1>
              <p><strong>Puesto actual:</strong> {trabajador.puesto}</p>
              <p><strong>Correo:</strong> {trabajador.correo}</p>
              <p><strong>Teléfono:</strong> {trabajador.telefono}</p>
              <p><strong>Inicio de trabajo:</strong> {trabajador.inicioTrabajo}</p>
              <p><strong>Disponibilidad:</strong> {trabajador.disponibilidad}</p>
              <p><strong>Salario actual:</strong> {trabajador.salario}</p>
            </div>
            <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                <Image
                    src="/coverlg.jpg"
                    alt={trabajador.nombre}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mt-6">Historial:</h2>
          <div className="mt-4 space-y-6">
            {trabajador.historial.map((evento, index) => (
              <div key={index} className="p-4 rounded-sm shadow-md mb-4">
                <div className="flex justify-between">
                  <h3 className="font-bold">{evento.tipo}</h3>
                  <p className="text-gray-600">{evento.fecha} {evento.hora}</p>
                </div>
                <p><strong>Dueño/a:</strong> {evento.cliente}</p>
                <p><strong>Animal:</strong> {evento.animal}</p>
                {evento.detalles.map((detalle, i) => (
                  <p key={i} className="text-gray-700">{detalle.concepto} - {detalle.costo}</p>
                ))}
                <p className="font-bold mt-2">Total: {evento.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };


export default EmployeeDetails;