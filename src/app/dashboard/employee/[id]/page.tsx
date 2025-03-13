import EmployeeDetails from "@/components/employee/EmployeeDetails";


const Page = ({ params }: { params: { id: string } }) => {
  const trabajadorMock = {
    id: params.id,
    nombre: "Katrina Bennet",
    puesto: "Veterinaria",
    correo: "kbennet@gmail.com",
    telefono: "0981 234 567",
    inicioTrabajo: "03/02/2022",
    disponibilidad: "Lunes a Viernes",
    salario: "3.200.000 Gs. Mensuales",
    foto: "/coverlg.jpg",
    historial: [
      {
        tipo: "Servicio de Vacunación",
        fecha: "5/11/2024",
        hora: "17:30",
        cliente: "Marta Perez",
        animal: "Perro",
        detalles: [
          { concepto: "Vacuna triple felina y 3 más...", costo: "50.000 gs." },
          { concepto: "Servicio de transporte", costo: "15.000 gs." }
        ],
        total: "75.000 Gs."
      },
      {
        tipo: "Servicio de Consulta clínica",
        fecha: "6/11/2024",
        hora: "17:30",
        cliente: "Marta Perez",
        animal: "Perro",
        detalles: [
          { concepto: "Consulta", costo: "50.000 gs." },
          { concepto: "Servicio de transporte", costo: "15.000 gs." }
        ],
        total: "75.000 Gs."
      }
    ]
  };


  return (
   
      <EmployeeDetails trabajador={trabajadorMock} />
 
  );
};


export default Page;