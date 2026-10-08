export function getCoursePriceNote(priceLabel = "") {
  const label = typeof priceLabel === "string" ? priceLabel.trim() : "";
  if (!label) return "";

  const note = label.replace(
    /^\s*(?:presencial\s*:\s*)?(?:USD\s*)?(?:US\$|[$€£])\s*[\d.,]+\s*(?:USD|ARS)?\s*[·|–—-]\s*/i,
    ""
  ).trim();

  if (note !== label) return note;
  if (/^\s*(?:USD\s*)?(?:US\$|[$€£])\s*[\d.,]+\s*(?:USD|ARS)?\s*$/i.test(label)) {
    return "";
  }

  return label;
}

export function formatCoursePrice(course) {
  const note = getCoursePriceNote(course.price_label);
  if (!course.is_paid) return note || "Sin costo";

  const amount = ((course.price_cents || 0) / 100).toLocaleString("en-US", {
    style: "currency",
    currency: course.currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return note ? `${amount} · ${note}` : amount;
}
