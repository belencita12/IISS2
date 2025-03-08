'use client';


import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button" 
import ContactSection from '@/components/aboutPage/ContactSection';

export default function About() {
  return (
    <div className="mx-auto py-6 px-[4%] space-y-12">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <section className="text-center flex flex-col items-center self-start">
        <h1 className="text-4xl font-bold">Sobre Nosotros</h1>
        <p className="mt-4 text-lg w-[80%]">
        Somos una veterinaria con más de 8 años de experiencia con experiencia y más experiencia en peinados de perro y gato. Si te gustan los animales es esta tu veterinaria
        </p>
        <div className="flex justify-center mt-6">
          <Image src="/image.png" alt="NicoPets Logo" width={300} height={300} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Nuestros Servicios</h2>
        <ul className="mt-4 space-y-3  list-inside text-justify">
        <li><strong>Vacunación y Desparasitación</strong>:<br />
        <p className="before:content-['•'] before:mr-2 before:text-black before:inline-block">
         Mantén un registro de todas las vacunas aplicadas, fechas de aplicación y próxima dosis, con notificaciones automáticas para recordar a los dueños de mascotas. También puedes incluir los tratamientos de desparasitación.   
        </p>
        </li>
        <li><strong>Medicamentos y Tratamientos</strong>:<br />
         <p className="before:content-['•'] before:mr-2 before:text-black before:inline-block">
        Gestión de medicamentos recetados y tratamientos, incluyendo historial de prescripciones, dosis, y frecuencia. Ideal para el seguimiento de enfermedades crónicas o condiciones que requieran un control constante.    
         </p>
        </li>
        <li><strong>Baños y Cuidado de Higiene</strong>:<br />
        <p className="before:content-['•'] before:mr-2 before:text-black before:inline-block">
         Servicio para agendar baños, corte de uñas, limpieza de oídos y otros cuidados básicos de higiene. Este servicio permite a los dueños reservar citas y llevar un seguimiento del historial de higiene.   
        </p>
        </li>
        <li><strong>Peluquería Canina/Felina</strong>:<br />
        <p className="before:content-['•'] before:mr-2 before:text-black before:inline-block">
         Los usuarios pueden solicitar el servicio de peluquería para cortar, estilizar y acondicionar el pelaje de sus mascotas. Incluye opciones para especificar el tipo de corte y un historial de cortes previos.   
        </p>
        </li>
        <li><strong>Control de Salud y Check-Ups</strong>:<br />
        <p className="before:content-['•'] before:mr-2 before:text-black before:inline-block">
        Servicio de control de salud rutinario para evaluar el bienestar general de la mascota, detectar posibles enfermedades y llevar un registro de los resultados de cada chequeo.    
        </p>
        </li>
        <li><strong>Productos de la Veterinaria</strong>:<br />
        <p className="before:content-['•'] before:mr-2 before:text-black before:inline-block">
        Catálogo de productos a la venta en la veterinaria, como alimentos, juguetes, productos de higiene y accesorios. Los usuarios pueden ver disponibilidad, precios y especificaciones de cada producto.    
        </p>
        </li>
        <li><strong>Servicio de Urgencias y Emergencias</strong>:<br />
        <p className="before:content-['•'] before:mr-2 before:text-black before:inline-block">
        Información sobre la disponibilidad de atención de emergencias, contacto rápido y guía para el cuidado de la mascota en caso de una situación crítica.    
        </p>
        </li>
        <li><strong>Servicio de Guardería y Hotel para Mascotas</strong>:<br />
        <p className="before:content-['•'] before:mr-2 before:text-black before:inline-block">
         Opción de reservar estancias temporales para mascotas en caso de viaje o necesidades especiales. Incluye detalles sobre instalaciones, alimentación y actividades diarias.   
        </p>
        </li>
        <li><strong>Asesoría y Consultas Veterinarias en Línea</strong>:<br />
        <p className="before:content-['•'] before:mr-2 before:text-black before:inline-block">
        Posibilidad de realizar consultas con veterinarios a través de la app para resolver dudas rápidas o recibir orientación sin necesidad de acudir a la clínica.    
        </p>
        </li>
        </ul>

      {/* <div className="text-left pt-5 ">
        <Link href="/registro-mascota">
          <Button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
            Registrar Mascota
          </Button>
        </Link>
      </div>  */}
      </section> 
       
    </div>
    
      <ContactSection />
    </div>
  );
}
