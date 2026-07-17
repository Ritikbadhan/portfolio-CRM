export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString();
};

export const isValidDate = (date: unknown): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};
