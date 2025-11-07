import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/dev.env';
import { variable } from '../enum/variable.enum';

let httpClient: HttpClient;
const apiBaseUrl: string = environment.baseUrl;

// call this function once from the app component to initialize the httpClient variable
export const setHttpClient = (client: HttpClient) => {
  httpClient = client;
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
export const httpGet = <RType>(url: string, showLoader: boolean = true): Observable<RType> => {
  return getHttpClient().get<RType>(apiBaseUrl + url, {
    headers: getHeaderWithLoaderConfigure(showLoader),
  });
};

export const httpPost = <RType, PType>(
  url: string,
  payload: PType,
  showLoader: boolean = true
): Observable<RType> => {
  return getHttpClient().post<RType>(apiBaseUrl + url, payload, {
    headers: getHeaderWithLoaderConfigure(showLoader),
  });
};

export const httpPut = <RType, PType>(
  url: string,
  payload: PType,
  showLoader: boolean = true
): Observable<RType> => {
  return getHttpClient().put<RType>(apiBaseUrl + url, payload, {
    headers: getHeaderWithLoaderConfigure(showLoader),
  });
};

export const httpDelete = <T>(url: string, showLoader: boolean = true): Observable<T> => {
  return getHttpClient().delete<T>(apiBaseUrl + url, {
    headers: getHeaderWithLoaderConfigure(showLoader),
  });
};
