import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { IGenericResponse } from '../../core/interface/response/responseGeneric';
import { LoginResponse } from '../../core/interface/response/login.response';
import { loginForm, loginPayload } from '../../core/interface/request/login';
import { Base, Validation } from '@portal/core';
import { ApiRoutes, EToastType, localStorageEnum, setLocalStorageItem, ToastService } from '@shared';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Validation],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login extends Base {
  public loginForm = new FormGroup<loginForm>({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private toster: ToastService, private router: Router) {
    super();
  }

  public login() {
    if (this.loginForm.valid) {
      const loginPayload: loginPayload = {
        username: this.loginForm.controls.username.value || '',
        password: this.loginForm.controls.password.value || '',
      };
      this.httpPostPromise<IGenericResponse<LoginResponse>, loginPayload>(
        ApiRoutes.LOGIN.BASE,
        loginPayload
      )
        .then((response) => {
          if (response && response.data) {
            this.toster.show({ message: 'Login Successful', duration: 3000, type: EToastType.success });
            setLocalStorageItem(localStorageEnum.token, response.data?.token || '');
            setLocalStorageItem(localStorageEnum.refreshToken, response.data?.refreshToken || '');
            this.router.navigate([this.appRoutes.DASHBOARD]);
          }
        })
        .catch((error: HttpErrorResponse) => {
          this.toster.show({
            message: 'Invalid username or password',
            duration: 3000,
            type: EToastType.error,
          });
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
