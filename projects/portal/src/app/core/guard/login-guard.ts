import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getLocalStorageItem } from '@shared';


export const loginGuard: CanActivateFn = (route, state) => {
  let token = getLocalStorageItem('token')
  let router = inject(Router)

  if (!token) {
    return true
  }

  return router.navigate(['/dashboard'])
 
};
