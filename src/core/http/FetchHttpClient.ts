/**
 * Implementação de IHttpClient usando Fetch API
 */

import {
  IHttpClient,
  RequestConfig,
  ResponseData,
  HttpError,
} from './IHttpClient';

export class FetchHttpClient implements IHttpClient {
  private baseURL: string;
  private requestInterceptor?: (config: RequestConfig) => RequestConfig;
  private responseInterceptor?: (response: ResponseData) => ResponseData;
  private errorInterceptor?: (error: HttpError) => Promise<never>;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  private async request<T = any>(
    method: string,
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ResponseData<T>> {
    let requestConfig: RequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      ...config,
    };

    // Aplicar interceptor de requisição
    if (this.requestInterceptor) {
      requestConfig = this.requestInterceptor(requestConfig);
    }

    const fullUrl = new URL(url, this.baseURL).toString();
    const fetchOptions: RequestInit = {
      method,
      headers: requestConfig.headers,
    };

    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }

    if (requestConfig.params) {
      const params = new URLSearchParams(requestConfig.params);
      const separator = fullUrl.includes('?') ? '&' : '?';
      const urlWithParams = `${fullUrl}${separator}${params.toString()}`;
      try {
        const response = await fetch(urlWithParams, fetchOptions);
        return this.handleResponse<T>(response);
      } catch (error) {
        return this.handleError(error);
      }
    }

    try {
      const response = await fetch(fullUrl, fetchOptions);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async handleResponse<T>(response: Response): Promise<ResponseData<T>> {
    const contentType = response.headers.get('content-type');
    let data: T;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = (await response.text()) as any;
    }

    const responseData: ResponseData<T> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    };

    if (!response.ok) {
      const error: HttpError = new Error(response.statusText);
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = data;

      if (this.errorInterceptor) {
        return this.errorInterceptor(error);
      }
      throw error;
    }

    // Aplicar interceptor de resposta
    if (this.responseInterceptor) {
      return this.responseInterceptor(responseData);
    }

    return responseData;
  }

  private async handleError(error: any): Promise<never> {
    const httpError: HttpError = new Error(error.message);
    httpError.status = 0;

    if (this.errorInterceptor) {
      return this.errorInterceptor(httpError);
    }
    throw httpError;
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>('POST', url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>('PATCH', url, data, config);
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  setRequestInterceptor(interceptor: (config: RequestConfig) => RequestConfig): void {
    this.requestInterceptor = interceptor;
  }

  setResponseInterceptor(interceptor: (response: ResponseData) => ResponseData): void {
    this.responseInterceptor = interceptor;
  }

  setErrorInterceptor(interceptor: (error: HttpError) => Promise<never>): void {
    this.errorInterceptor = interceptor;
  }
}

