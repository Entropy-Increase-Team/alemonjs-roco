import axios, { type AxiosRequestConfig } from 'axios';

export function isHttpOk(status: number): boolean {
  return status >= 200 && status < 300;
}

export async function requestJson<T>(config: AxiosRequestConfig): Promise<{ status: number; data: T | null }> {
  const response = await axios.request<T>({
    ...config,
    validateStatus: () => true
  });

  return {
    status: response.status,
    data: response.data ?? null
  };
}

export async function requestText(config: AxiosRequestConfig): Promise<{ status: number; data: string }> {
  const response = await axios.request<string>({
    ...config,
    responseType: 'text',
    validateStatus: () => true
  });

  return {
    status: response.status,
    data: response.data ?? ''
  };
}
