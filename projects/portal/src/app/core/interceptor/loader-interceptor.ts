import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { variable } from '../enum/variable.enum';
import { LoaderService } from '../services/loader-service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService: LoaderService = inject(LoaderService);

  const showloader: boolean = req.headers.get(variable.headerLoader) == 'true' ? true : false;

  if (showloader) {
    loaderService.showLoader();
  }

  return next(req).pipe(
    finalize(() => {
      if (showloader) {
        loaderService.hideLoader();
      }
    })
  );
};
