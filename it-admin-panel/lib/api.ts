export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
    // Ensure fresh data in app router
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
  }
  // Try parse JSON if any
  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
}

// Departments
export async function getDepartments() {
  return request(`/departments`);
}
export async function getDepartment(id: number | string) {
  return request(`/departments/${id}`);
}
export async function createDepartment(data: { name: string }) {
  return request(`/departments`, { method: 'POST', body: JSON.stringify(data) });
}
export async function updateDepartment(id: number | string, data: { name?: string }) {
  return request(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function deleteDepartment(id: number | string) {
  return request(`/departments/${id}`, { method: 'DELETE' });
}

// Employees
export async function getEmployees() {
  return request(`/employees`);
}
export async function getEmployee(id: number | string) {
  return request(`/employees/${id}`);
}
export async function createEmployee(data: {
  name: string;
  surname: string;
  role: string;
  departmentId: number;
  phone?: string;
  email: string;
}) {
  return request(`/employees`, { method: 'POST', body: JSON.stringify(data) });
}
export async function updateEmployee(
  id: number | string,
  data: Partial<{ name: string; surname: string; role: string; departmentId: number; phone?: string; email: string }>,
) {
  return request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function deleteEmployee(id: number | string) {
  return request(`/employees/${id}`, { method: 'DELETE' });
}

// Devices
export async function getDevices() {
  return request(`/devices`);
}
export async function getDevice(id: number | string) {
  return request(`/devices/${id}`);
}
export async function createDevice(data: { typeId: number; status: string; userId?: number; departmentId?: number }) {
  return request(`/devices`, { method: 'POST', body: JSON.stringify(data) });
}
export async function updateDevice(
  id: number | string,
  data: Partial<{ typeId: number; status: string; userId?: number; departmentId?: number }>,
) {
  return request(`/devices/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function deleteDevice(id: number | string) {
  return request(`/devices/${id}`, { method: 'DELETE' });
}

// Printers
export async function getPrinters() {
  return request(`/printers`);
}
export async function getPrinter(id: number | string) {
  return request(`/printers/${id}`);
}
export async function createPrinter(data: { model: string; departmentId: number }) {
  return request(`/printers`, { method: 'POST', body: JSON.stringify(data) });
}
export async function updatePrinter(id: number | string, data: Partial<{ model: string; departmentId: number }>) {
  return request(`/printers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function deletePrinter(id: number | string) {
  return request(`/printers/${id}`, { method: 'DELETE' });
}

export async function getCartridges() {
  return request(`/cartridges`);
}

export async function getConsumables() {
  return request(`/consumables`);
}

export async function getNotifications() {
  return request(`/notifications`);
}

export async function getDeviceReports() {
  return request(`/reports/devices`);
}

// Device Types
export async function getDeviceTypes() {
  return request(`/device-types`);
}
export async function createDeviceType(data: { name: string }) {
  return request(`/device-types`, { method: 'POST', body: JSON.stringify(data) });
}
