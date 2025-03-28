import { z } from "zod";
import {
  rucFormatRegExp,
  timeFormatRegExp,
  validatePhoneNumber,
} from "./utils";

export const phoneNumber = () =>
  z
    .string()
    .min(1, "El número de telefono es obligatorio")
    .refine((str) => validatePhoneNumber(str), {
      message: "Número de telefono inválido",
    });

export const ruc = () =>
  z
    .string()
    .min(1, "El RUC es obligatorio")
    .refine((str) => rucFormatRegExp.test(str), { message: "RUC inválido" });

export const shiftTime = () =>
  z
    .string()
    .min(1, "La hora es obligatoria")
    .refine((str) => timeFormatRegExp.test(str), {
      message: "Formato de hora inválido",
    });
