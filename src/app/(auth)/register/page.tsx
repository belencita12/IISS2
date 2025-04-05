import { RegisterForm } from "@/components/register/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md my-10">
      <h1 className="text-2xl font-bold text-gray-900 text-center">Registro</h1>
      <p className="text-sm text-gray-600 text-center mb-6">
        Complete el formulario para crear una nueva cuenta
      </p>
      
      <RegisterForm  />
    </div>
  );
}