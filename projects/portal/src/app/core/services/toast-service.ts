import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../interface/model/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public _toast$ = new BehaviorSubject<Toast | null>(null);
  // toast$ = this._toast$.asObservable();

  public show(toast: Toast) {
    this._toast$.next(toast);
    setTimeout(() => this._toast$.next(null), toast.duration || 3000);
  }
}
