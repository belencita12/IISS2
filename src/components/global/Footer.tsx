export default function Footer() {
  return (
    <footer className="relative mt-10 bg-gray-100">

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a855f7]/30 to-transparent" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="group cursor-default">
            <h3 className="font-semibold text-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent ">
              Sistema de Veterinaria
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 text-sm">
            <span className="font-extrabold text-gray-600">© 2025 Todos los derechos reservados</span>
            <span className="sm:block text-gray-600">|</span>
            <a 
              href="/terms"
              className="text-[#a855f7] hover:text-[#ec4899] transition-colors duration-300 font-bold"
            >
              Términos & Condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}