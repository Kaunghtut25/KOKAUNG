let counter = 0;

export function generateBookingRef(): string {
  const year = new Date().getFullYear();
  counter += 1;
  return `HOC-${year}-${String(counter).padStart(5, '0')}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
