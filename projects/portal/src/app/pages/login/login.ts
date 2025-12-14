import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IGenericResponse } from '../../core/interface/response/genericResponse';
import { Base } from '@portal/core';
import { ApiRoutes, EToastType, ILoginForm, ILoginFormData, localStorageEnum, setLocalStorageItem, ToastService, ValidateControl } from '@shared';
import { CommonModule } from '@angular/common';
import { AppLoadingButton } from '@shared';
import { LoginResponse } from './login.model';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ValidateControl, CommonModule,  AppLoadingButton],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login extends Base implements OnInit {
  public loginForm = new FormGroup<ILoginForm>({
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    fcmToken: new FormControl(''),
  });
  public showPassword: boolean = false
   public isBtnLoader: WritableSignal<boolean> = signal(false);
  constructor(private _toastService: ToastService, private router: Router) {
    super();
  }

  ngOnInit(): void {
  }

  public login() {
    if (this.loginForm.valid) {
      const loginPayload: ILoginFormData = {
        username: this.loginForm.controls.username.value || '',
        password: this.loginForm.controls.password.value || '',
        fcmToken: ""
      };
      this.isBtnLoader.set(true);
      this.httpPostPromise<IGenericResponse<LoginResponse>, ILoginFormData>(
        ApiRoutes.LOGIN.BASE,
        loginPayload
      )
        .then((response) => {
          if (response && response.data) {
            setLocalStorageItem(localStorageEnum.token, response.data?.token || '');
            setLocalStorageItem(localStorageEnum.refreshToken, response.data?.refreshToken || '');
            this._toastService.show({ message: 'Login Successful', duration: 3000, type: EToastType.success });
            this.router.navigate([this.appRoutes.DASHBOARD]);
          }
          else {
            this._toastService.show({
              message: response.errorMessage,
              type: EToastType.error,
              duration: 2000,
            });
          }
           this.isBtnLoader.update(() => false);
        })
        .catch(error => {
         this.isBtnLoader.update(() => false);
          //  handle error 
        })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  public togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
