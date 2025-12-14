import { Component, model, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiRoutes, EToastType, httpPost, IRegisterForm, IRegisterFormData, IRGeneric, patternWithMessage, ToastService, ValidateControl, NumberOnlyValidators } from '@shared';
import { ButtonLoader, EAuthManager } from '@website/core';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, ButtonLoader, ValidateControl, NumberOnlyValidators],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  public authType = model.required<EAuthManager>();
  public isShowloader = model.required<boolean>();

  public registerForm: FormGroup<IRegisterForm> = new FormGroup<IRegisterForm>({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null),
    email: new FormControl(null),
    contact: new FormControl(null, [
      Validators.required,
      patternWithMessage(/^(?:\+91|91)?[6789]\d{9}$/, 'Enter a valid mobile number.'),
      Validators.maxLength(10), Validators.minLength(10)
    ]),
    userName: new FormControl(null),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  });

  ngOnInit(): void { }

  constructor(private _toastService: ToastService) { }

  public openLoginForm() {
    this.authType.set(EAuthManager.login);
  }

  public registerUser() {
    if (this.registerForm.valid) {
      this.isShowloader.set(true);
      httpPost<IRGeneric<boolean>, IRegisterFormData>(
        ApiRoutes.LOGIN.REGISTER_CUSTOMER,
        <IRegisterFormData>this.registerForm.value
      ).subscribe({
        next: (res: IRGeneric<boolean>) => {
          if (res) {
            if (res.data) {
              this.authType.set(EAuthManager.login);
              this._toastService.show({
                message: 'User registered successfully',
                type: EToastType.success,
                duration: 2000,
              });
            } else {
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
      this.registerForm.markAllAsTouched();
    }
  }
}
