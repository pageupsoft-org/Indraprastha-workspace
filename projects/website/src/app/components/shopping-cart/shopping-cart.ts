import {
  Component,
  computed,
  ElementRef,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import {
  ApiRoutes,
  ConfirmationUtil,
  EToastType,
  getDefaultConfirmationModalData,
  httpDelete,
  IRGeneric,
  Loader,
  setLocalStorageItem,
  ToastService,
} from '@shared';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  CartUpdateOperation,
  appRoutes,
  UtilityService,
  CartService,
  LocalStorageEnum,
} from '@website/core';
import { ProductCardSizeEdit } from '../product-card-size-edit/product-card-size-edit';
import { IProductCardSizeDT } from '../product-card-size-edit/product-card-size-edit.model';
import { IRCartRoot } from './shopping-cart.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-shopping-cart',
  imports: [Loader, CurrencyPipe, CommonModule, ProductCardSizeEdit],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCart {
  cart = viewChild<ElementRef>('shoppingCart');
  cartOverlay = viewChild<ElementRef>('cartOverlay');

  public showLoader: WritableSignal<boolean> = signal(false);
  public CartUpdateOperation = CartUpdateOperation;

  public readonly homeRoute = appRoutes.HOME;

  constructor(
    private utilService: UtilityService,
    public cartService: CartService,
    private router: Router,
    public matDialog: MatDialog
  ) {}

  public openCart() {
    this.cartOverlay()?.nativeElement.classList.remove('hidden');
    this.cart()?.nativeElement.classList.remove('translate-x-full');

    this.getData();
  }

  public hideCart() {
    this.cart()?.nativeElement.classList.add('translate-x-full');
    this.cartOverlay()?.nativeElement.classList.add('hidden');
    // this.cartService.cartData.set([]);
  }

  public alterQuantityCnt(operation: CartUpdateOperation, index: number) {
    this.cartService.alterQuantityCnt(operation, index);
  }

  private getData() {
    this.showLoader.set(true);
    this.cartService.getCartProduct().finally(() => {
      this.showLoader.set(false);
    });
  }
  public getDataForCard(index: number): IProductCardSizeDT {
    const data: IRCartRoot = this.cartService.cartData()[index];

    return {
      imageUrl: data.productURL,
      name: data.name,
      mrp: data.mrp,
      color: data.color?.[0] ?? '',
      qty: data.cartQuantity,
      stock: {
        id: data.stockId,
        name: data.size,
      },

      variant: data.cartVariant
        ? {
            id: data.cartVariant.variantId,
            name: data.cartVariant.name,
            mrp: data.cartVariant.mrp,
          }
        : undefined,

      isShowDelete: true,
    };
  }

  public routeToHome() {
    this.hideCart();
    this.router.navigate([appRoutes.HOME]);
  }
  public routeToCheckout() {
    this.hideCart();
    this.router.navigate([appRoutes.CHECKOUT]);
  }

  public removeItemFromCart(cartId: number, index: number) {
    this.cartService.removeItemFromCart(cartId, index);
    // this.objCOnfirmationUtil
    //   .getConfirmation(
    //     getDefaultConfirmationModalData('Remove item', 'Are you sure you want to remove this item?')
    //   )
    //   .then((res: boolean) => {
    //     if (res) {
    //       if (this.utilService.isUserLoggedIn()) {
    //         httpDelete<IRGeneric<boolean>>(ApiRoutes.CART.DELETE_ITEM_FROM_CART(cartId)).subscribe({
    //           next: (res) => {
    //             if (res?.data) {
    //               this.cartService.cartData.update((currentCart) =>
    //                 currentCart.filter((item) => item.cartId !== cartId)
    //               );

    //               this.toastService.show({
    //                 message: 'Product removed',
    //                 type: EToastType.success,
    //                 duration: 2000,
    //               });
    //             }
    //           },
    //         });
    //       } else {
    //         this.cartService.cartData.update((currentCart) =>
    //           currentCart.filter((item, prodIndex) => prodIndex !== index)
    //         );
    //         setLocalStorageItem(LocalStorageEnum.cartList, this.cartService.cartData());
    //         this.toastService.show({
    //           message: 'Product removed',
    //           type: EToastType.success,
    //           duration: 2000,
    //         });
    //       }
    //     }
    //   });
  }
}
