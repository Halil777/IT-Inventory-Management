export const normalizeKey = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, '');

export const toTitleCase = (value: string): string => {
  const cleaned = value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return '';
  }

  return cleaned
    .split(' ')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ');
};
