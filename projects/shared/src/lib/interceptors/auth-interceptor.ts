import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast-service';
import { getLocalStorageItem, setLocalStorageItem, UseFetch } from '../utils/utility.util';
import { localStorageEnum } from '../enum/localStorage.enum';
import { PlatformService } from '../services/platform-service';
import { EToastType } from '../enum/toast-type.enum';
import { httpPost } from '../utils/api.helper';
import { IRGeneric } from '../interface/response/generic.response';
import { IRLogin } from '../interface/response/login.response';
import { ApiRoutes } from '../const/apiRoutes.const';
import { clearLocalStorage } from '@shared';

// import { getLocalStorageItem, localStorageEnum, ToastService } from '@shared';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const toastService = inject(ToastService);
//   const router = inject(Router);
//   const platformService: PlatformService = inject(PlatformService);

//   let token: string | null = null;
//   try {
//     token = getLocalStorageItem<string>(localStorageEnum.token);
//   } catch (err) {
//     console.error('Token fetch error:', err);
//   }

//   if (token) {
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     // console.log(req);
//   }

//   return next(req).pipe(
//     catchError((error: HttpErrorResponse) => {
//       let errorMessage = 'An unexpected error occurred';

//       if (platformService.isBrowser && error.error instanceof ErrorEvent) {
//         // Browser-only client-side error
//         errorMessage = `Error: ${error.error.message}`;
//       } else {
//         // Server-side (SSR) or normal backend error
//         switch (error.status) {
//           case 400:
//             errorMessage = getValidationErrorMessage(error) || 'Invalid request';
//             break;
//           case 401:
//             refreshToken(toastService, router);
//             break;
//           case 403:
//             errorMessage = 'You are not authorized to perform this action';
//             break;
//           case 404:
//             errorMessage = 'The requested resource was not found';
//             break;
//           case 500:
//             errorMessage = 'A server error occurred. Please try again later.';
//             break;
//           default:
//             errorMessage = `Error: ${error.message}`;
//         }
//       }

//       return throwError(() => ({
//         message: errorMessage,
//         originalError: error,
//       }));
//     })
//   );
// };
export function authInterceptor(type: 'website' | 'portal'): HttpInterceptorFn {
  return (req, next) => {
    const toastService = inject(ToastService);
    const router = inject(Router);
    const platformService: PlatformService = inject(PlatformService);

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
          'Content-Type': 'application/json',
        },
      });
    }

    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';

        if (platformService.isBrowser && error.error instanceof ErrorEvent) {
          // Browser-only client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side (SSR) or backend error
          switch (error.status) {
            case 400:
              errorMessage = getValidationErrorMessage(error) || 'Invalid request';
              break;
            case 401:
              refreshToken(toastService, router, type);
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

        return throwError(() => ({
          message: errorMessage,
          originalError: error,
        }));
      })
    );
  };
}

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
async function refreshToken(
  toastService: ToastService,
  router: Router,
  type: 'website' | 'portal'
) {
  try {
    const res = await UseFetch(refreshTokenFn());
    if (res?.data && res.data?.token) {
      setLocalStorageItem(localStorageEnum.token, res.data.token);
      setLocalStorageItem(localStorageEnum.refreshToken, res.data.refreshToken);
      return true;
    } else {
      toastService.show({
        type: EToastType.error,
        message: 'Token expired. Please login again.',
        duration: 800,
      });
      
      if (type == 'website') {
        router.navigate(['/login']);
      }
      
      clearLocalStorage();
      return false;
    }
  } catch (error) {
    clearLocalStorage();
    router.navigate(['/login']);
    return false;
  }
}

function refreshTokenFn() {
  const data = {
    token: getLocalStorageItem<string>(localStorageEnum.token),
    refreshToken: getLocalStorageItem<string>(localStorageEnum.refreshToken),
  };
  return httpPost<IRGeneric<IRLogin>, typeof data>(ApiRoutes.LOGIN.SILENT_LOGIN, data);
}
