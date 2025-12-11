import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  HostListener,
  model,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { GenderMenu } from './gender-menu/gender-menu';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShoppingCart } from '../shopping-cart/shopping-cart';
import { AuthManager } from '../auth-manager/auth-manager';
import {
  ApiRoutes,
  clearLocalStorageItems,
  createUrlFromObject,
  deCodeToken,
  EToastType,
  GenderTypeEnum,
  httpGet,
  initializePagInationPayload,
  IRGeneric,
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
import { Profile } from './profile/profile';
import {
  IAddressPayload,
  IProfileResponse,
} from './profile/profile-upsert-dialog/profile-upsert-dialog.models';

@Component({
  selector: 'app-header',
  imports: [GenderMenu, RouterLink, CommonModule, ShoppingCart, AuthManager, FormsModule, Profile],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  @ViewChild('shoppingCartRef') shoppingCartRef!: ShoppingCart;
  @ViewChild('authFormRef') authFormRef!: AuthManager;

  public readonly appRoutes = appRoutes;

  public GenderTypeEnum = GenderTypeEnum;

  public activeGender: WritableSignal<GenderTypeEnum | ''> = signal('');
  private timeout: any;

  public isCartOpen: WritableSignal<boolean> = signal(false);
  public dropdownOpen: boolean = false;

  // public isProfileMounted: WritableSignal<boolean> = signal<boolean>(false);
  public isProfileMounted: WritableSignal<boolean> = signal<boolean>(false);

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
  ) {}

  ngOnInit(): void {
    if (this._utitlityService.isUserLoggedIn()) {
      const tokenData = deCodeToken();
      if (tokenData?.Id) {
        const id = parseInt(tokenData?.Id);
        this.getProfileData(id);
      }
      this.getUserAddress();
    }
  }

  public openProfile() {
    this.isProfileMounted.update(() => true);
    this.dropdownOpen = false;
  }

  public removeFromDom() {
    setTimeout(() => {
      this.isProfileMounted.update(() => false);
    }, 400); //THIS TIME SHOULD MATCH THE CLOSING ANIMATION TIME OF PROFILE
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
      this.payloadGenderMenu.search = this.searchText() ?? '';
      this.router.navigate([createUrlFromObject(this.payloadGenderMenu, '')]);
      this.searchText.set(null);
    }
  }

  public setGender(type: GenderTypeEnum | ''): void {
    clearTimeout(this.timeout);
    this.activeGender.set(type);
  }

  public clearGender(): void {
    this.timeout = setTimeout(() => {
      this.activeGender.set('');
    }, 110);
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

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    this.dropdownOpen = false;
  }

  public getProfileData(id: number) {
    httpGet<IRGeneric<IProfileResponse>>(ApiRoutes.CUSTOMERS.GET_BY_ID(id), false).subscribe({
      next: (response) => {
        if (response) {
          if (response.data) {
            this._utitlityService.profileData.set(response.data);
          }
        }
      },
    });
  }

  public getUserAddress() {
    httpGet<IRGeneric<IAddressPayload[]>>(
      ApiRoutes.CUSTOMERS.GET_SHIPPING_ADDRESS,
      false
    ).subscribe({
      next: (response) => {
        if (response) {
          if (response.data) {
            this._utitlityService.AddressData.set(response.data);
          }
        }
      },
    });
  }
}
