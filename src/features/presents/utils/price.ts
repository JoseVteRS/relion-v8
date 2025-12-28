/**
 * Convierte un string de precio (ej: "27,50" o "27.50") a centavos.
 * Soporta comas y puntos como separador decimal.
 */
export function priceToCents(value: string | undefined | null): number | undefined {
  if (!value?.trim()) return undefined;
  const normalized = value.replace(",", ".");
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? undefined : Math.round(parsed * 100);
}

