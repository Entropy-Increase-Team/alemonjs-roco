import { type AxiosRequestConfig } from 'axios';
export declare function isHttpOk(status: number): boolean;
export declare function requestJson<T>(config: AxiosRequestConfig): Promise<{
    status: number;
    data: T | null;
}>;
export declare function requestText(config: AxiosRequestConfig): Promise<{
    status: number;
    data: string;
}>;
