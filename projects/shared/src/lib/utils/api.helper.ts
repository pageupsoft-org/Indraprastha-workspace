import { HttpClient, HttpContext, HttpContextToken, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { variable } from '../enum/variable.enum';

let httpClient: HttpClient;
let apiBaseUrl: string = '';

// call this function once from the app component to initialize the httpClient variable
export const setHttpClient = (client: HttpClient, baseUrl: string) => {
  httpClient = client;
  apiBaseUrl = baseUrl;
};

export const getHttpClient = (): HttpClient => {
  if (!httpClient) {
    throw new Error('HttpClient not initialized. Call setHttpClient() first.');
  }
  return httpClient;
};

const getHeaderWithLoaderConfigure = (showLoader: boolean): HttpHeaders => {
  const header = new HttpHeaders({
    [variable.headerLoader]: showLoader.toString(),
  });

  return header;
};

// Generic API functions
export const httpGet = <RType>(
  url: string,
  showLoader: boolean = true,
  context: Array<{ key: HttpContextToken<any>; value: any }> | null = null
): Observable<RType> => {
  let httpContext = new HttpContext();

  if (context) {
    context.forEach((c) => {
      httpContext = httpContext.set(c.key, c.value);
    });
  }

  return getHttpClient().get<RType>(apiBaseUrl + url, {
    headers: getHeaderWithLoaderConfigure(showLoader),
    context: httpContext,
  });
};

export const httpPost = <RType, PType>(
  url: string,
  payload: PType,
  showLoader: boolean = true,
  context: Array<{ key: HttpContextToken<any>; value: any }> | null = null
): Observable<RType> => {
  let httpContext = new HttpContext();

  if (context) {
    context.forEach((c) => {
      httpContext = httpContext.set(c.key, c.value);
    });
  }

  return getHttpClient().post<RType>(apiBaseUrl + url, payload, {
    headers: getHeaderWithLoaderConfigure(showLoader),
    context: httpContext,
  });
};

export const httpPut = <RType, PType>(
  url: string,
  payload: PType,
  showLoader: boolean = true,
  context: Array<{ key: HttpContextToken<any>; value: any }> | null = null
): Observable<RType> => {
  let httpContext = new HttpContext();

  if (context) {
    context.forEach((c) => {
      httpContext = httpContext.set(c.key, c.value);
    });
  }

  return getHttpClient().put<RType>(apiBaseUrl + url, payload, {
    headers: getHeaderWithLoaderConfigure(showLoader),
    context: httpContext
  });
};

export const httpDelete = <T>(url: string, showLoader: boolean = true): Observable<T> => {
  return getHttpClient().delete<T>(apiBaseUrl + url, {
    headers: getHeaderWithLoaderConfigure(showLoader),
  });
};
