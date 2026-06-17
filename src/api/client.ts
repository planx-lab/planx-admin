const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(`API ${status}: ${message}`);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => 'Unknown error');
    throw new ApiError(res.status, body);
  }
  return res.json();
}

export const api = { get: request };
