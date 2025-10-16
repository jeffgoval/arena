/**
 * Supabase HTTP Client Implementation
 * Implementação de IHttpClient usando Supabase REST API
 */

import { IHttpClient, HttpResponse, HttpError } from './IHttpClient';

export class SupabaseHttpClient implements IHttpClient {
  private baseUrl: string;
  private anonKey: string;
  private timeout: number;

  constructor(
    baseUrl: string = import.meta.env.VITE_SUPABASE_URL,
    anonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY,
    timeout: number = 30000
  ) {
    this.baseUrl = baseUrl;
    this.anonKey = anonKey;
    this.timeout = timeout;
  }

  /**
   * Build headers for Supabase API requests
   */
  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.anonKey}`,
      'apikey': this.anonKey,
      ...customHeaders,
    };
  }

  /**
   * Build full URL for Supabase REST API
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseUrl}/rest/v1${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Handle response and errors
   */
  private async handleResponse<T>(response: Response): Promise<HttpResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error: HttpError = {
        status: response.status,
        message: data?.message || data?.error_description || 'HTTP Error',
        data: data,
      };
      throw error;
    }

    return {
      status: response.status,
      data: data as T,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    options?: { params?: Record<string, any>; headers?: Record<string, string> }
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(options?.headers),
        signal: controller.signal,
      });

      return this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string> }
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(options?.headers),
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      return this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string> }
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(options?.headers),
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      return this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string> }
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(options?.headers),
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      return this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options?: { headers?: Record<string, string> }
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(options?.headers),
        signal: controller.signal,
      });

      return this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

