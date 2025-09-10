export const DEFAULT_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

async function request(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`${DEFAULT_API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
  }
  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
}

export function getDevices(): Promise<any> {
  return request('/devices');
}

export function createDevice(data: {
  typeId: number;
  userId?: number;
  departmentId?: number;
  status: string;
  serialNumber?: string;
  model?: string;
}): Promise<any> {
  return request('/devices', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateDevice(
  id: number,
  data: {
    typeId?: number;
    userId?: number;
    departmentId?: number;
    status?: string;
    serialNumber?: string;
    model?: string;
  },
): Promise<any> {
  return request(`/devices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteDevice(id: number): Promise<any> {
  return request(`/devices/${id}`, { method: 'DELETE' });
}

export function getCredentials(): Promise<any> {
  return request('/credentials');
}

export function createCredential(data: {
  fullName: string;
  login: string;
  password: string;
}): Promise<any> {
  return request('/credentials', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCredential(
  id: number,
  data: { fullName?: string; login?: string; password?: string },
): Promise<any> {
  return request(`/credentials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCredential(id: number): Promise<any> {
  return request(`/credentials/${id}`, { method: 'DELETE' });
}

export function getDeviceTypes(): Promise<any> {
  return request('/device-types');
}

export function getPrinters(): Promise<any> {
  return request('/printers');
}

export function getEmployees(): Promise<any> {
  return request('/employees');
}

export function createEmployee(data: {
  name: string;
  email: string;
  phone?: string;
  civilNumber?: string;
  departmentId?: number;
  role?: string;
  status: string;
}): Promise<any> {
  return request('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateEmployee(
  id: number,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    civilNumber?: string;
    departmentId?: number;
    role?: string;
    status?: string;
  },
): Promise<any> {
  return request(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteEmployee(id: number): Promise<any> {
  return request(`/employees/${id}`, { method: 'DELETE' });
}

export function getDepartments(): Promise<any> {
  return request('/departments');
}

export function createDepartment(data: { name: string }): Promise<any> {
  return request('/departments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateDepartment(
  id: number,
  data: { name: string },
): Promise<any> {
  return request(`/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteDepartment(id: number): Promise<any> {
  return request(`/departments/${id}`, { method: 'DELETE' });
}

export function getConsumables(): Promise<any> {
  return request('/consumables');
}

export function getNotifications(): Promise<any> {
  return request('/notifications');
}

export function getAuditLogs(): Promise<any> {
  return request('/audit-logs');
}
