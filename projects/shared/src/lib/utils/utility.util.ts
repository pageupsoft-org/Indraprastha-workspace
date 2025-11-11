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
