import urls from "@/lib/urls";

export default function Footer() {
    return (
      <footer className="bg-gray-200 text-center py-4 mt-10">
        <p>© 2024 Sistema de Veterinaria</p>
        <nav className="mt-2">
          <a href={urls.CONTACT} className="text-blue-600">Contact us</a> |
          <a href={urls.TERMS} className="text-blue-600"> Términos & Condiciones</a>
        </nav>
      </footer>
    );
  }
  