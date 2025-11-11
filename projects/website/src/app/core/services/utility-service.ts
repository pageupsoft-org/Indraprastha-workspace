import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  public isUserLoggedIn: WritableSignal<boolean> = signal(false);

  constructor(){
  }
}
