export const categoryMap = {
    SERVICE: "Servicio",
    PRODUCT: "Producto",
    VACCINE: "Vacuna",
    none: "Ninguno",
  };
  
  export const getCategoryLabel = (key: string) => {
    return categoryMap[key as keyof typeof categoryMap] || key;
  };
  