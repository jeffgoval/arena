/**
 * Interface abstrata para cliente HTTP
 * Permite trocar entre Fetch, Axios, Supabase, etc.
 */

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

export interface ResponseData<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface HttpError extends Error {
  status?: number;
  statusText?: string;
  data?: any;
}

export interface IHttpClient {
  /**
   * Faz uma requisição GET
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>>;

  /**
   * Faz uma requisição POST
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>>;

  /**
   * Faz uma requisição PUT
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>>;

  /**
   * Faz uma requisição PATCH
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>>;

  /**
   * Faz uma requisição DELETE
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>>;

  /**
   * Define um interceptor de requisição
   */
  setRequestInterceptor(interceptor: (config: RequestConfig) => RequestConfig): void;

  /**
   * Define um interceptor de resposta
   */
  setResponseInterceptor(interceptor: (response: ResponseData) => ResponseData): void;

  /**
   * Define um interceptor de erro
   */
  setErrorInterceptor(interceptor: (error: HttpError) => Promise<never>): void;
}

