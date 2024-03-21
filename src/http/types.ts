import { ZodType } from 'zod';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface SdkConfig {
  baseUrl: string;
  auth?: AuthOptions;
}

export interface HttpRequest<T> extends Options<T> {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
}

export interface HttpMetadata {
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface HttpResponse<T> {
  data?: T;
  metadata: HttpMetadata;
  body: ArrayBuffer;
}

export interface RequestHandler {
  next?: RequestHandler;

  handle<T>(request: HttpRequest<T>): Promise<HttpResponse<T>>;
}

export interface Options<T> {
  responseSchema: ZodType<T, any, any>;
  body?: BodyInit;
  abortSignal?: AbortSignal;
  queryParams?: Record<string, unknown>;
  retry?: RetryOptions;
  auth?: AuthOptions;
}

export interface RetryOptions {
  attempts: number;
  delayMs: number;
}

export interface RequestConfig {
  retry?: RetryOptions;
}

export interface AuthOptions {
  username: string;
  password?: string;
}
