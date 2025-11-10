import { Component, model } from '@angular/core';
import { EAuthManager } from '../../../core/enum/auth-manager.enum';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonLoader } from "../../../core/component/button-loader/button-loader";
import { ApiRoutes, ErrorHandler, EToastType, httpPost, ILoginForm, ILoginFormData, IRGeneric, IRLogin, ToastService } from '@shared';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ErrorHandler, ButtonLoader],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  public authType = model.required<EAuthManager>();
  public isShowloader = model.required<boolean>();

  public loginForm: FormGroup<ILoginForm> = new FormGroup<ILoginForm>({
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

      httpPost<IRGeneric<IRLogin>, ILoginFormData>(
        ApiRoutes.LOGIN.BASE,
        <ILoginFormData>this.loginForm.value
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
