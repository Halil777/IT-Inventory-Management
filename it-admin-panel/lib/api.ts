export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getDepartments() {
  const res = await fetch(`${API_URL}/departments`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch departments');
  }
  return res.json();
}
