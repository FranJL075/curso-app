export const COURSE_TEXT_LIMITS = {
  category: 30,
  title: 50,
  summary: 125,
  description: 300,
  duration: 55,
  modality: 55,
  includes: 130,
  requirements: 170,
  payment: 70,
  price_label: 160,
  image_url: 2048,
  currency: 5,
};

const COURSE_FIELD_LABELS = {
  category: "Categoría",
  title: "Título",
  summary: "Resumen",
  description: "Descripción",
  duration: "Duración",
  modality: "Modalidad",
  includes: "Qué incluye",
  requirements: "Requisitos",
  payment: "Información de pago",
  price_label: "Texto adicional del precio",
  image_url: "URL de imagen",
  currency: "Moneda",
};

export function getCourseTextLengthError(data) {
  for (const [field, limit] of Object.entries(COURSE_TEXT_LIMITS)) {
    const value = data[field];
    if (typeof value === "string" && value.length > limit) {
      return `${COURSE_FIELD_LABELS[field]} no puede superar los ${limit} caracteres.`;
    }
  }
  return null;
}
