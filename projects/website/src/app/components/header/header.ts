import { Component, model, signal, ViewChild, WritableSignal } from '@angular/core';
import { GenderMenu } from './gender-menu/gender-menu';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShoppingCart } from '../shopping-cart/shopping-cart';
import { AuthManager } from '../auth-manager/auth-manager';
import {
  clearLocalStorageItems,
  createUrlFromObject,
  EToastType,
  GenderTypeEnum,
  initializePagInationPayload,
} from '@shared';
import { ToastService } from '@shared';
import {
  appRoutes,
  CartService,
  IRequestProductMenu,
  UtilityService,
  WishlistService,
} from '@website/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [GenderMenu, RouterLink, CommonModule, ShoppingCart, AuthManager, FormsModule],
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

  public isSearchInputVisible: WritableSignal<boolean> = signal(false);
  public searchText = model<string | null>();
  private payloadGenderMenu: IRequestProductMenu = {
    ...initializePagInationPayload(),
    gender: null,
    collectionIds: [],
    categoryIds: [],
    colors: [],
    sizes: [],
    minPrice: 0,
    maxPrice: 0,
    newlyAdded: false,
  };

  constructor(
    public _utitlityService: UtilityService,
    private router: Router,
    private _toastService: ToastService,
    public cartService: CartService,
    public wishlistService: WishlistService
  ) {
    // _utitlityService.isUserLoggedIn.set(true);
  }

  public updateSearchInputVisibility() {
    this.isSearchInputVisible.update((val) => !val);
  }

  public openCart() {
    this.shoppingCartRef.openCart();
  }

  public openAuthForm() {
    this.authFormRef.openForm();
  }
  public search(event: any) {
    if (event.key === 'Enter') {
      this.payloadGenderMenu.search = this.searchText() ?? "";
      this.router.navigate([createUrlFromObject(this.payloadGenderMenu, '')]);
      this.isSearchInputVisible.update(() => false);
      this.searchText.set(null);
    }
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
    this.cartService.cartData.update(() => []);
    this.wishlistService.wishlistProducts.update(() => []);
    this._utitlityService.isUserLoggedIn.set(false);
    this._toastService.show({
      message: 'Logout success',
      type: EToastType.success,
      duration: 2000,
    });
  }
}
