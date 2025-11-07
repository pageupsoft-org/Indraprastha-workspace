import { Component, model } from '@angular/core';
import { EAuthManager } from '../../../core/enum/auth-manager.enum';
import { IMLogin, IDLogin } from '../../../core/interface/model/login.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorHandler } from '../../../core/directive/error-handler';
import { httpPost } from '../../../core/utils/api.helper';
import { IRGeneric } from '../../../core/interface/response/generic.response';
import { IRLogin } from '../../../core/interface/response/login.response';
import { APIRoutes } from '../../../core/const/api-routes.const';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../core/services/toast-service';
import { ButtonLoader } from "../../../core/component/button-loader/button-loader";
import { EToastType } from '../../../core/enum/toast-type.enum';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ErrorHandler, ButtonLoader],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  public authType = model.required<EAuthManager>();
  public isShowloader = model.required<boolean>();

  public loginForm: FormGroup<IMLogin> = new FormGroup<IMLogin>({
    userName: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  });

  constructor(private _toastService: ToastService) {}

  public openRegisterForm() {
    this.authType.set(EAuthManager.register);
  }

  public login() {
    if (this.loginForm.valid) {
      this.isShowloader.set(true);

      httpPost<IRGeneric<IRLogin>, IDLogin>(
        APIRoutes.LOGIN.BASE,
        <IDLogin>this.loginForm.value
      ).subscribe({
        next: (res: IRGeneric<IRLogin>) => {
          if (res) {
            if (res.data) {
              this._toastService.show({
                message: 'Login success',
                type: EToastType.success,
                duration: 2000,
              });
            }
            else{
               this._toastService.show({
                message: res.errorMessage,
                type: EToastType.error,
                duration: 2000,
              });
            }
          }

          this.isShowloader.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.isShowloader.set(false);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
