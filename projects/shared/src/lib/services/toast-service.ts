import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastModel } from '../interface/model/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toast$ = new BehaviorSubject<ToastModel | null>(null);
  toast$ = this._toast$.asObservable();

  public show(toast: ToastModel) {
    this._toast$.next(toast);
    setTimeout(() => this._toast$.next(null), toast.duration || 3000);
  }

  public close() {
    this._toast$.next(null);
  }
}
