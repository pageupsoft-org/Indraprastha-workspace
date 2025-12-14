import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedUtilService {
  public localStorageCleared: EventEmitter<void> = new EventEmitter<void>();
}
