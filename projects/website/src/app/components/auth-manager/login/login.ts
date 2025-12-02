import { Component, model, output } from '@angular/core';
import { EAuthManager } from '../../../core/enum/auth-manager.enum';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonLoader } from '../../../core/component/button-loader/button-loader';
import {
  ApiRoutes,
  ErrorHandler,
  EToastType,
  httpPost,
  ILoginForm,
  ILoginFormData,
  IRGeneric,
  IRLogin,
  localStorageEnum,
  setLocalStorageItem,
  ToastService,
} from '@shared';
import { UtilityService } from '../../../core/services/utility-service';
import { CartService } from '../../../core/services/cart-service';
import { WishlistService } from '../../../core/services/wishlist-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ErrorHandler, ButtonLoader],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  public authType = model.required<EAuthManager>();
  public isShowloader = model.required<boolean>();

  public closeForm = output<void>();

  public loginForm: FormGroup<ILoginForm> = new FormGroup<ILoginForm>({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    fcmToken: new FormControl(''),
  });

  constructor(
    private _toastService: ToastService,
    private _utilityService: UtilityService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

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
              this._utilityService.isUserLoggedIn.set(true);
              setLocalStorageItem(localStorageEnum.token, res.data.token);
              setLocalStorageItem(localStorageEnum.refreshToken, res.data.refreshToken);
              this._toastService.show({
                message: 'Login success',
                type: EToastType.success,
                duration: 2000,
              });
              this.closeForm.emit();
              this.loginForm.reset();

              this.cartService.addLocalStorageCartToDb();
              this.wishlistService.getWishlistProduct();
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
      this.loginForm.markAllAsTouched();
    }
  }
}
