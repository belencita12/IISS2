"use client";

import Image from "next/image";
import ContactSection from "@/components/aboutPage/ContactSection";
import { Heart, Users, Clock } from "lucide-react";

export default function About() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="w-full bg-gradient-to-r from-myPurple-tertiary to-myPink-tertiary py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Sobre Nosotros
                </h1>
                <div className="w-20 h-1 bg-white mx-auto my-6"></div>
                <p className="text-white text-lg max-w-2xl mx-auto px-4">
                    Conoce más sobre nuestra clínica veterinaria y los servicios
                    que ofrecemos para tus mascotas
                </p>
            </div>

            <div className="container mx-auto py-16 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex justify-center">
                        <Image
                            src="/image.png"
                            alt="NicoPets Logo"
                            width={500}
                            height={500}
                            className="object-contain"
                        />
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-myPurple-primary">
                            Somos NicoPets
                        </h2>

                        <p className="text-gray-700">
                            Somos una veterinaria con más de 8 años de
                            experiencia cuidando de la salud y bienestar de
                            perros y gatos. Nuestro equipo está formado por
                            profesionales apasionados por los animales,
                            dedicados a ofrecer el mejor servicio y atención.
                        </p>

                        <p className="text-gray-700">
                            En NicoPets entendemos que tu mascota es parte de tu
                            familia, por eso nos esforzamos en brindar un
                            servicio personalizado y de calidad, en un ambiente
                            cálido y acogedor donde tu mascota se sienta cómoda
                            y segura.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 bg-myPurple-disabled/30 text-myPurple-primary px-4 py-2 rounded-full">
                                <Heart className="w-5 h-5" />
                                <span>Atención personalizada</span>
                            </div>

                            <div className="flex items-center gap-2 bg-myPink-disabled/30 text-myPink-primary px-4 py-2 rounded-full">
                                <Users className="w-5 h-5" />
                                <span>Equipo profesional</span>
                            </div>

                            <div className="flex items-center gap-2 bg-myPurple-disabled/30 text-myPurple-primary px-4 py-2 rounded-full">
                                <Clock className="w-5 h-5" />
                                <span>Servicio de emergencias</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <h2 className="text-2xl font-semibold text-myPurple-primary mb-6">
                        Nuestros Servicios
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <li className="space-y-2">
                            <h3 className="text-lg font-bold text-myPink-primary">
                                Vacunación y Desparasitación
                            </h3>
                            <p className="text-gray-700 before:content-['•'] before:mr-2 before:text-myPink-primary before:inline-block">
                                Mantén un registro de todas las vacunas
                                aplicadas, fechas de aplicación y próxima dosis,
                                con notificaciones automáticas para recordar a
                                los dueños de mascotas. También puedes incluir
                                los tratamientos de desparasitación.
                            </p>
                        </li>
                        <li className="space-y-2">
                            <h3 className="text-lg font-bold text-myPink-primary">
                                Medicamentos y Tratamientos
                            </h3>
                            <p className="text-gray-700 before:content-['•'] before:mr-2 before:text-myPink-primary before:inline-block">
                                Gestión de medicamentos recetados y
                                tratamientos, incluyendo historial de
                                prescripciones, dosis, y frecuencia. Ideal para
                                el seguimiento de enfermedades crónicas o
                                condiciones que requieran un control constante.
                            </p>
                        </li>
                        <li className="space-y-2">
                            <h3 className="text-lg font-bold text-myPink-primary">
                                Baños y Cuidado de Higiene
                            </h3>
                            <p className="text-gray-700 before:content-['•'] before:mr-2 before:text-myPink-primary before:inline-block">
                                Servicio para agendar baños, corte de uñas,
                                limpieza de oídos y otros cuidados básicos de
                                higiene. Este servicio permite a los dueños
                                reservar citas y llevar un seguimiento del
                                historial de higiene.
                            </p>
                        </li>
                        <li className="space-y-2">
                            <h3 className="text-lg font-bold text-myPink-primary">
                                Peluquería Canina/Felina
                            </h3>
                            <p className="text-gray-700 before:content-['•'] before:mr-2 before:text-myPink-primary before:inline-block">
                                Los usuarios pueden solicitar el servicio de
                                peluquería para cortar, estilizar y acondicionar
                                el pelaje de sus mascotas. Incluye opciones para
                                especificar el tipo de corte y un historial de
                                cortes previos.
                            </p>
                        </li>
                        <li className="space-y-2">
                            <h3 className="text-lg font-bold text-myPink-primary">
                                Control de Salud y Check-Ups
                            </h3>
                            <p className="text-gray-700 before:content-['•'] before:mr-2 before:text-myPink-primary before:inline-block">
                                Servicio de control de salud rutinario para
                                evaluar el bienestar general de la mascota,
                                detectar posibles enfermedades y llevar un
                                registro de los resultados de cada chequeo.
                            </p>
                        </li>
                        <li className="space-y-2">
                            <h3 className="text-lg font-bold text-myPink-primary">
                                Productos de la Veterinaria
                            </h3>
                            <p className="text-gray-700 before:content-['•'] before:mr-2 before:text-myPink-primary before:inline-block">
                                Catálogo de productos a la venta en la
                                veterinaria, como alimentos, juguetes, productos
                                de higiene y accesorios. Los usuarios pueden ver
                                disponibilidad, precios y especificaciones de
                                cada producto.
                            </p>
                        </li>
                        <li className="space-y-2">
                            <h3 className="text-lg font-bold text-myPink-primary">
                                Servicio de Urgencias y Emergencias
                            </h3>
                            <p className="text-gray-700 before:content-['•'] before:mr-2 before:text-myPink-primary before:inline-block">
                                Información sobre la disponibilidad de atención
                                de emergencias, contacto rápido y guía para el
                                cuidado de la mascota en caso de una situación
                                crítica.
                            </p>
                        </li>
                        <li className="space-y-2">
                            <h3 className="text-lg font-bold text-myPink-primary">
                                Servicio de Guardería y Hotel para Mascotas
                            </h3>
                            <p className="text-gray-700 before:content-['•'] before:mr-2 before:text-myPink-primary before:inline-block">
                                Opción de reservar estancias temporales para
                                mascotas en caso de viaje o necesidades
                                especiales. Incluye detalles sobre
                                instalaciones, alimentación y actividades
                                diarias.
                            </p>
                        </li>
                        <li className="space-y-2">
                            <h3 className="text-lg font-bold text-myPink-primary">
                                Asesoría y Consultas Veterinarias en Línea
                            </h3>
                            <p className="text-gray-700 before:content-['•'] before:mr-2 before:text-myPink-primary before:inline-block">
                                Posibilidad de realizar consultas con
                                veterinarios a través de la app para resolver
                                dudas rápidas o recibir orientación sin
                                necesidad de acudir a la clínica.
                            </p>
                        </li>
                    </ul>
                </div>
                <ContactSection />
            </div>
        </div>
    );
}
