export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getISODateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString();
};

