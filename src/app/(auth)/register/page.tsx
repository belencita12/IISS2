import { RegisterForm } from "@/components/register/RegisterForm";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations();
  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md my-10">
      <h1 className="text-2xl font-bold text-gray-900 text-center">{t("register.form.title")}</h1>
      <p className="text-sm text-gray-600 text-center mb-6">
        {t("register.form.description")}
      </p>
      
      <RegisterForm  />
    </div>
  );
}