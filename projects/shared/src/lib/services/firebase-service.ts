import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { Router } from '@angular/router';
import { ToastService } from './toast-service';
import { EToastType } from '../enum/toast-type.enum';
import { firebaseKey } from '../environments/firebase.env';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  public currentToken: string = '';
  constructor(private _toasterService: ToastService, private router: Router) {}

  public requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: firebaseKey.vapidKey })
      .then((token) => {
        if (token) {
          // this._toasterService.success('Hurraaa!!! we got the token.....');
          this.currentToken = token;
          console.log(token);
        } else {
          this._toasterService.show({
            message: 'No registration token available. Request permission to generate one.',
            type: EToastType.error,
            duration: 2000,
          });
        }
      })
      .catch((err) => {
        // this._toastreService.error('Error retrieving token. ', err);
        this._toasterService.show({
          message: 'Error retrieving token. ',
          type: EToastType.error,
          duration: 2000,
        });
        if (err.code === 'messaging/permission-blocked') {
        }
      });
  }

  public listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      const notificationType = payload.data?.['NotificationType'];
      // if (
      //   (notificationType === 'DeleteAccount' || notificationType === 'ChangePasswordOrRole') &&
      //   localStorage.getItem(environment.tokenKey)
      // ) {
      // this.loginService.logout(this.currentToken).subscribe({
      //     next: (res) => {
      //         if (notificationType == 'DeleteAccount') {
      //             this._toasterService.info("You Account has been deactivated.")
      //         }
      //         else if (notificationType == 'ChangePasswordOrRole') {
      //             this._toasterService.info("You Role has been changed.")
      //         }
      //         localStorage.clear();
      //         this.router.navigate(['/login']);
      //     }
      // });
      // }
    });
  }
}
