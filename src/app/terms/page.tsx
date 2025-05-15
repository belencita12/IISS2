import { Heart } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen ">
      {/* Decorative header background */}
      <div className="absolute top-8 left-0 right-0 h-80 -z-20 bg-gradient-to-r from-myPurple-primary to-myPink-primary opacity-90 pt-72">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-16 ">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white bg-clip-text text-transparent">
              Términos y Condiciones
            </h1>
            <div className="flex items-center justify-center gap-2 text-white">
              <span>Última actualización:</span>
              <span className="bg-myPurple-disabled text-myPurple-focus px-3 py-1 rounded-full text-sm font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Introduction Card */}
          <div className="bg-gradient-to-r from-myPurple-disabled to-myPink-disabled rounded-2xl p-8 mb-12 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 -mb-8 -ml-8 bg-white/10 rounded-full"></div>

            <h2 className="text-2xl font-bold text-myPurple-focus mb-4 relative z-10">Términos y Condiciones</h2>
            <p className="text-gray-700 mb-6 relative z-10 leading-relaxed">
              Estos términos y condiciones describen las reglas y regulaciones para el uso de nuestros servicios
              veterinarios. Al acceder a nuestros servicios, usted acepta estar sujeto a estos términos. Por favor,
              léalos cuidadosamente.
            </p>
            <div className="flex items-center gap-2 text-myPink-focus relative z-10">
              <Heart className="h-5 w-5" />
              <span className="font-medium">Cuidamos a tus mascotas como si fueran nuestras</span>
            </div>
          </div>

          {/* Terms Accordion */}
          <div className="bg-white rounded-2xl shadow-xl p-2 mb-12">
            <Accordion type="single" collapsible className="w-full">
              {termsData.map((term, index) => (
                <AccordionItem
                  key={`item-${index + 1}`}
                  value={`item-${index + 1}`}
                  className="border-b border-myPurple-disabled last:border-0 px-4"
                >
                  <AccordionTrigger className="py-6 text-lg font-semibold hover:text-myPurple-primary transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-myPurple-disabled text-myPurple-primary group-hover:bg-myPurple-primary group-hover:text-white transition-colors">
                        {index + 1}
                      </div>
                      <span>{term.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-6 pl-11">{term.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Acceptance Notice */}
          <div className="bg-gradient-to-br from-myPurple-primary to-myPink-primary rounded-2xl p-8 text-white shadow-xl mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-32 -mr-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -mb-24 -ml-24"></div>

            <p className="text-center text-white italic relative z-10">
              Al utilizar nuestros servicios, usted confirma que ha leído, entendido y aceptado estos términos y
              condiciones.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

// Data for terms sections
const termsData = [
  {
    title: "Aceptación de Términos",
    content: (
      <p>
        Al acceder a nuestros servicios, usted acepta estar sujeto a estos términos y condiciones, todas las leyes y
        regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables. Si no
        está de acuerdo con alguno de estos términos, está prohibido utilizar o acceder a nuestros servicios.
      </p>
    ),
  },
  {
    title: "Servicios Veterinarios",
    content: (
      <>
        <p className="mb-4">
          NicoPets ofrece servicios de atención veterinaria para mascotas. Nuestros servicios incluyen pero no se
          limitan a:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Consultas médicas y exámenes de rutina</li>
          <li>Vacunaciones y desparasitaciones</li>
          <li>Cirugías y procedimientos médicos</li>
          <li>Servicios de emergencia</li>
          <li>Análisis clínicos y diagnósticos</li>
          <li>Venta de medicamentos y alimentos para mascotas</li>
        </ul>
      </>
    ),
  },
  {
    title: "Citas y Atención",
    content: (
      <>
        <p className="mb-4">
          Las citas deben ser programadas con anticipación, excepto en casos de emergencia. NicoPets se reserva el
          derecho de priorizar la atención según la gravedad de los casos.
        </p>
        <p>
          El propietario de la mascota debe llegar puntualmente a su cita programada. En caso de no poder asistir, se
          solicita cancelar con al menos 24 horas de anticipación. Las citas no canceladas o canceladas con menos de 24
          horas de anticipación podrían estar sujetas a un cargo por inasistencia.
        </p>
      </>
    ),
  },
  {
    title: "Responsabilidades del Propietario",
    content: (
      <>
        <p className="mb-4">El propietario de la mascota es responsable de:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Proporcionar información precisa y completa sobre la salud y el historial médico de su mascota</li>
          <li>Seguir las recomendaciones y tratamientos prescritos por nuestros veterinarios</li>
          <li>Mantener el control de su mascota durante la visita a nuestras instalaciones</li>
          <li>Realizar los pagos correspondientes por los servicios prestados</li>
        </ul>
      </>
    ),
  },
  {
    title: "Pagos y Facturación",
    content: (
      <>
        <p className="mb-4">
          Los pagos por servicios veterinarios deben realizarse al momento de la prestación del servicio, a menos que se
          haya acordado previamente un plan de pago.
        </p>
        <p className="mb-4">
          Aceptamos pagos en efectivo, tarjetas de crédito/débito y transferencias bancarias. Para tratamientos extensos
          o procedimientos costosos, podría requerirse un depósito previo.
        </p>
        <p>
          Las facturas no pagadas podrían resultar en la adición de cargos por intereses y/o la remisión a una agencia
          de cobros.
        </p>
      </>
    ),
  },
  {
    title: "Consentimiento para Tratamiento",
    content: (
      <p>
        Al solicitar nuestros servicios, el propietario de la mascota otorga consentimiento para que NicoPets realice
        los procedimientos diagnósticos y terapéuticos necesarios para el cuidado de su mascota. En casos de
        procedimientos que impliquen riesgos significativos, se solicitará un consentimiento específico por escrito.
      </p>
    ),
  },
  {
    title: "Confidencialidad y Privacidad",
    content: (
      <p>
        NicoPets se compromete a mantener la confidencialidad de la información médica de las mascotas y la información
        personal de sus propietarios. No compartiremos esta información con terceros sin su consentimiento, excepto
        cuando sea requerido por ley o para proteger la salud pública.
      </p>
    ),
  },
  {
    title: "Limitación de Responsabilidad",
    content: (
      <p>
        Aunque nos esforzamos por proporcionar el mejor cuidado posible, NicoPets no puede garantizar resultados
        específicos de los tratamientos. No seremos responsables por daños indirectos, incidentales o consecuentes
        relacionados con nuestros servicios. Nuestra responsabilidad se limita al costo de los servicios prestados.
      </p>
    ),
  },
  {
    title: "Modificaciones a los Términos",
    content: (
      <p>
        NicoPets se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Las
        modificaciones entrarán en vigor inmediatamente después de su publicación. El uso continuado de nuestros
        servicios después de tales modificaciones constituirá su aceptación de los nuevos términos.
      </p>
    ),
  },
  {
    title: "Ley Aplicable",
    content: (
      <p>
        Estos términos y condiciones se rigen por las leyes del país/estado donde NicoPets opera, sin consideración a
        conflictos de principios legales.
      </p>
    ),
  },
]
