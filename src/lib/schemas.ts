import { z } from "zod";
import {
  rucFormatRegExp,
  timeFormatRegExp,
  validatePhoneNumber,
} from "./utils";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constants/image";

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

export const image = () =>
  z
    .instanceof(File)
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
      message: "Solo se permiten imágenes en formato JPG, PNG o WEBP",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "La imagen no debe superar 1MB",
    })
    .optional();
