import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { getLocalStorageItem, localStorageEnum, ToastService } from '@shared';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const router = inject(Router);

  let token: string | null = null;
  try {
    token = getLocalStorageItem<string>(localStorageEnum.token);
  } catch (err) {
    console.error('Token fetch error:', err);
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });    
  }
 

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = getValidationErrorMessage(error) || 'Invalid request';
            break;
          case 401:
            refreshToken(toastService, router);
            break;
          case 403:
            errorMessage = 'You are not authorized to perform this action';
            break;
          case 404:
            errorMessage = 'The requested resource was not found';
            break;
          case 500:
            errorMessage = 'A server error occurred. Please try again later.';
            break;
          default:
            errorMessage = `Error: ${error.message}`;
        }
      }

      // toastService.error(errorMessage);
      return throwError(() => ({
        message: errorMessage,
        originalError: error,
      }));
    })
  );
};

// ✅ helper for validation errors
function getValidationErrorMessage(error: HttpErrorResponse): string | null {
  if (error.error?.errors) {
    const firstError = Object.values(error.error.errors)[0];
    if (Array.isArray(firstError)) {
      return firstError[0];
    }
    return String(firstError);
  }
  return null;
}

// ✅ helper for refresh token
async function refreshToken(toastService: ToastService, router: Router) {
  try {
    console.log("Refresh Token called")
    // const res = await UseFetch(refreshTokenFn()); // ✅ correctly passes Observable
    return true;
    // if (res?.data) {
    //   // localStorage.setItem(localStorageEnum.token, res.data.token);
    //   // localStorage.setItem(localStorageEnum.refreshToken, res.data.refreshToken);
    // //   setLocalStorageItem(localStorageEnum.token, res.data.token);
    // //   setLocalStorageItem(localStorageEnum.refreshToken, res.data.refreshToken);

    // //   const attemptedUrl = localStorage.getItem('attemptedUrl');
    // //   localStorage.removeItem('attemptedUrl');

    // //   router.navigate([attemptedUrl || '/dashboard']);
    // //   toastService.success('Token refreshed');
    //   return true;
    // } else {
    //   localStorage.clear();
    //   router.navigate(['/login']);
    //   return false;
    // }
  } catch (error) {
    localStorage.clear();
    router.navigate(['/login']);
    return false;
  }
}

function refreshTokenFn() {
  console.log("refreshTokenFn called")
  const data = {
    token: getLocalStorageItem<string>(localStorageEnum.token),
    refreshToken: getLocalStorageItem<string>(localStorageEnum.refreshToken),
  };
//   return httpPost<IResponse<ILoginResponse>, typeof data>(
//     apiRoutes.login.silentLogin,
//     data
//   );
}
