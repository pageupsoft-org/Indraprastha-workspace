import { Injectable, signal, WritableSignal } from '@angular/core';
import { IResponseGenderMenuRoot } from '../interface/response/gender-menu.response';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  public isUserLoggedIn: WritableSignal<boolean> = signal(false);

  public genderMenuData: WritableSignal<IResponseGenderMenuRoot[]> = signal([]);

  constructor(){
  }
}
