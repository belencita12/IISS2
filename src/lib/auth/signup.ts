import { RegisterFormSchema } from "@/components/register/RegisterForm";
import { z } from "zod";
import { AUTH_API } from "../urls";

export const signup = async (data: z.infer<typeof RegisterFormSchema>) => {
    try {
      const response = await fetch(`${AUTH_API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: `${data.name} ${data.lastname}`,
          email: data.email,
          password: data.password,
          adress: data.address,
          phoneNumber: data.phoneNumber,
          ruc: data.ruc,
        }),
      });
      if (!response.ok) {
        throw new Error("Error en el registro. Por favor, inténtelo de nuevo.");
      }
    } catch(error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };