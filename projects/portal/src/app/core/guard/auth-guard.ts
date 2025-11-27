import { CanActivateFn, Router } from '@angular/router';
import { getLocalStorageItem } from '@shared';


export const authGuard: CanActivateFn = (route, state) => {
  let token = getLocalStorageItem('token')

  if (token) {
    return true
  }

  // router.navigate[('/login')]
  return false;
};
