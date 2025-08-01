export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы в Date начинаются с 0
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
