export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getDepartments() {
  const res = await fetch(`${API_URL}/departments`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch departments');
  }
  return res.json();
}

export async function getEmployees() {
  const res = await fetch(`${API_URL}/employees`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch employees');
  }
  return res.json();
}

export async function getDevices() {
  const res = await fetch(`${API_URL}/devices`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch devices');
  }
  return res.json();
}

export async function getPrinters() {
  const res = await fetch(`${API_URL}/printers`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch printers');
  }
  return res.json();
}

export async function getCartridges() {
  const res = await fetch(`${API_URL}/cartridges`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch cartridges');
  }
  return res.json();
}

export async function getConsumables() {
  const res = await fetch(`${API_URL}/consumables`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch consumables');
  }
  return res.json();
}

export async function getNotifications() {
  const res = await fetch(`${API_URL}/notifications`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return res.json();
}

export async function getDeviceReports() {
  const res = await fetch(`${API_URL}/reports/devices`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch device reports');
  }
  return res.json();
}
