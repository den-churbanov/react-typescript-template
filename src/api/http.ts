import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export enum StatusCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  TooManyRequests = 429,
  InternalServerError = 500,
  ServiceUnavailable = 503,
  GatewayTimeout = 504
}

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest',
};

class HTTPClient {
  private readonly http: AxiosInstance | null = null;
  private readonly baseURL: string;

  constructor() {
    this.baseURL = '/api';

    this.http = axios.create({
      baseURL: this.baseURL,
      withCredentials: true,
      headers,
    });

    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;
        return HTTPClient.handleError(response);
      }
    );
  }

  getInstance() {
    return this.http;
  }

  getBaseUrl() {
    return this.baseURL;
  }

  request<T = any, RT = T, R = AxiosResponse<RT>>(config: AxiosRequestConfig): Promise<R> {
    return this.http.request(config);
  }

  get<T = any, RT = T, R = AxiosResponse<RT>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.http.get<T, R>(url, config);
  }

  post<T = any, RT = T, R = AxiosResponse<RT>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.post<T, R>(url, data, config);
  }

  put<T = any, RT = T, R = AxiosResponse<RT>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.put<T, R>(url, data, config);
  }

  patch<T = any, RT = T, R = AxiosResponse<RT>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.patch<T, R>(url, data, config);
  }

  delete<T = any, RT = T, R = AxiosResponse<RT>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.http.delete<T, R>(url, config);
  }

  public handleServerError(handleError: (error: AxiosResponse) => Promise<AxiosResponse>) {
    this.http.interceptors.response.use(
      response => response,
      error => handleError(error)
    );
  }

  private static handleError(error: AxiosResponse) {
    const { status } = error;

    const errorMessagesBadRequest = [];
    let errorText = null;

    switch (status) {

      case StatusCode.BadRequest: {
        if (typeof (error?.data) === "object") {
          for (let key in error?.data) {
            errorMessagesBadRequest.push(error?.data[key].toString())
          }
        }
        if (typeof (error?.data) === "string") {
          errorText = error.data;
        }
        break;
      }

      case StatusCode.Forbidden: {
        if (typeof error.data === 'string') {
          errorText = error.data;
        } else if ('detail' in error.data) {
          errorText = error.data.detail;
        } else {
          errorText = 'Действие запрещено';
        }
        break;
      }

      case StatusCode.Unauthorized: {
        const link = document.createElement('a');
        // link.href = login;
        link.click();
        break;
      }

      case StatusCode.NotFound: {
        if (typeof error.data === 'string') {
          errorText = error.data;
        } else if (Array.isArray(error.data)) {
          errorText = error.data.join('.');
        } else {
          errorText = 'Не найдено';
        }
        break;
      }
    }

    if (errorMessagesBadRequest.length > 0) {
      errorMessagesBadRequest.forEach(message => console.log(message))
    }

    if (errorText) console.log(errorText);

    return Promise.reject(error);
  }
}


export const http = new HTTPClient();

export const getBaseUrl = () => http.getBaseUrl();
export default http.getInstance();

