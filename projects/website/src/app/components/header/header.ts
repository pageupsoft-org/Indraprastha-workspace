import {
  Component,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { GenderMenu } from './gender-menu/gender-menu';
import { Router, RouterLink } from '@angular/router';
import { appRoutes } from '../../core/const/appRoutes.const';
import { CommonModule } from '@angular/common';
import { ShoppingCart } from '../shopping-cart/shopping-cart';
import { AuthManager } from "../auth-manager/auth-manager";
import { UtilityService } from '../../core/services/utility-service';
import { clearLocalStorageItems, EToastType, GenderTypeEnum } from '@shared';
import { ToastService } from '@shared';


@Component({
  selector: 'app-header',
  imports: [GenderMenu, RouterLink, CommonModule, ShoppingCart, AuthManager],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @ViewChild('shoppingCartRef') shoppingCartRef!: ShoppingCart;
  @ViewChild('authFormRef') authFormRef!: AuthManager;
  public readonly appRoutes = appRoutes;

  public GenderTypeEnum = GenderTypeEnum;

  public activeGender: WritableSignal<GenderTypeEnum | ''> = signal('');
  private timeout: any;
  public isDropdownVisible: WritableSignal<boolean> = signal(false);

  public isCartOpen: WritableSignal<boolean> = signal(false);
  public dropdownOpen: boolean = false;

  constructor(
    public _utitlityService: UtilityService, private router: Router, private _toastService: ToastService
  ) {
    // _utitlityService.isUserLoggedIn.set(true); 
  }

  public openCart() {
    this.shoppingCartRef.openCart();
  }

  public openAuthForm() {
    this.authFormRef.openForm();
  }

  public setGender(type: GenderTypeEnum | ''): void {
    clearTimeout(this.timeout);
    this.isDropdownVisible.set(true);
    this.activeGender.set(type);
  }

  public clearGender(): void {
    this.isDropdownVisible.set(false);
    this.timeout = setTimeout(() => {
      this.activeGender.set('');
      this.isDropdownVisible.set(false);
    }, 400);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.dropdownOpen = false;
    // Your logout logic here
    clearLocalStorageItems();
    this._utitlityService.isUserLoggedIn.set(false);
    this._toastService.show({
      message: 'Logout success',
      type: EToastType.success,
      duration: 2000,
    });
  }
}
