import { Observable } from 'rxjs';
import { MStringEnumToArray } from '../interface/model/utility.model';

export function UseFetch<R>(ob: Observable<R>): Promise<R> {
  const postPromise = new Promise<R>((resolve, reject) => {
    ob.subscribe({
      next: (res) => {
        resolve(res);
      },
      error: (err) => {
        reject(err);
      },
    });
  });
  return postPromise;
}

export function stringEnumToArray(enumObj: any): MStringEnumToArray[] {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key))) // to ignore numeric keys if any
    .map((key) => ({
      key,
      value: enumObj[key],
    }));
}

export function getStringEnumKeyByValue<T extends Record<string, string>>(
  enumObj: T,
  value: string
): keyof T | undefined {
  return (Object.keys(enumObj) as Array<keyof T>).find((key) => enumObj[key] === value);
}

export function getLocalStorageItem<T>(key: string): T | null {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }
  return null;
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
}

export function clearLocalStorageItems(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.log(error);
  }
}

export function convertImageToBase64(event: Event): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      reject('No file selected');
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
}

export function createUrlFromObject(object: Record<string, any>, baseUrl: string): string {
  const params = new URLSearchParams();

  for (const key in object) {
    const value = object[key];
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.append(key, String(value));
    }
  }

  return `${baseUrl}?${params.toString()}`;
}

export function getObjectFromUrl(
  url: string,
  arrayKeys: string[] = []
): { baseUrl: string; params: Record<string, any> } {
  const result: Record<string, any> = {};

  const [baseUrl, queryString] = url.includes('?') ? url.split('?') : [url, ''];
  const params = new URLSearchParams(queryString);

  const parseValue = (value: string): any => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(Number(value)) && value.trim() !== '') return Number(value);
    return value;
  };

  params.forEach((value, key) => {
    const parsed = parseValue(value);

    if (result[key]) {
      result[key] = Array.isArray(result[key]) ? [...result[key], parsed] : [result[key], parsed];
    } else {
      result[key] = arrayKeys.includes(key) ? [parsed] : parsed;
    }
  });

  // Ensure all arrayKeys exist, even if empty
  for (const key of arrayKeys) {
    if (!(key in result)) {
      result[key] = [];
    }
  }

  return { baseUrl, params: result };
}

/**
 * Converts a single JSON object (key-value map) into an array of { key: string, value: string } objects.
 * @param {Record<string, string>} obj The input JSON object.
 * @returns {Array<{key: string, value: string}>} The resulting array of objects.
 */
export function jsonToArray(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    console.error('Input must be a non-null, non-array object.');
    return [];
  }

  // Uses Object.keys to get all property keys, then uses 'map' to transform each key/value pair.
  return Object.keys(obj).map((key) => {
    return {
      key: String(key),
      value: String(obj[key]), // Ensure value is stored as a string, consistent with the input type
    };
  });
}
