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
  httpGet,
  httpPost,
  IRGeneric,
  Loader,
  setLocalStorageItem,
  ToastService,
} from '@shared';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ICartFormData } from '../../pages/product-detail/product-detail.model';
import { Router} from '@angular/router';
import { CartUpdateOperation, appRoutes, UtilityService, CartService, LocalStorageEnum } from '@website/core';

@Component({
  selector: 'app-shopping-cart',
  imports: [Loader, CurrencyPipe, CommonModule],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCart {
  cart = viewChild<ElementRef>('shoppingCart');
  cartOverlay = viewChild<ElementRef>('cartOverlay');

  public showLoader: WritableSignal<boolean> = signal(false);
  private objCOnfirmationUtil: ConfirmationUtil = new ConfirmationUtil();
  public CartUpdateOperation = CartUpdateOperation;

  public readonly homeRoute = appRoutes.HOME;

  constructor(
    private utilService: UtilityService,
    private toastService: ToastService,
    public cartService: CartService,
    private router: Router
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
    const cart = this.cartService.cartData();
    const item = cart[index];

    if (!item) return;

    // ❌ avoid decreasing when qty is already 1
    if (operation === CartUpdateOperation.decrease && item.cartQuantity === 1) {
      return;
    }

    this.cartService.cartData()[index]._isDisable = true;
    const newQty =
      operation === CartUpdateOperation.increase ? item.cartQuantity + 1 : item.cartQuantity - 1; // this will now be >= 1 always

    const payload: ICartFormData = {
      variantId: item.cartVariant?.variantId ?? null,
      stockId: item.stockId,
      quantity: newQty,
    };

    // Make API call FIRST
    this.updateCartProductQuantity(payload, index, operation);
  }

  private updateServiceVariable(data: ICartFormData, index: number) {
    this.cartService.cartData.update((cart) => {
      const updated = [...cart];

      if (data.quantity === 0) {
        // remove item from cart
        updated.splice(index, 1);
        return updated;
      }

      const item = { ...updated[index] };
      item.cartQuantity = data.quantity ?? 0;
      updated[index] = item;

      return updated;
    });

    if (!this.utilService.isUserLoggedIn()) {
      setLocalStorageItem(LocalStorageEnum.cartList, this.cartService.cartData());
    }
  }

  public updateCartProductQuantity(
    data: ICartFormData,
    index: number,
    operation: CartUpdateOperation
  ) {
    if (!this.utilService.isUserLoggedIn()) {
      this.updateServiceVariable(data, index);
      this.cartService.cartData()[index]._isDisable = false;
      return;
    }

    httpPost<IRGeneric<number>, ICartFormData>(ApiRoutes.CART.POST, data).subscribe({
      next: (res) => {
        if (!res?.data) return; // do nothing on failure

        // SUCCESS → Now update state
        this.updateServiceVariable(data, index);
        this.cartService.cartData()[index]._isDisable = false;
      },

      error: () => {
        // On error: do nothing, don't update UI
        this.cartService.cartData()[index]._isDisable = false;
      },
    });
  }

  private getData() {
    this.showLoader.set(true);
    this.cartService.getCartProduct().finally(() => {
      this.showLoader.set(false);
    });
  }

  public routeToHome(){
    this.hideCart();
    this.router.navigate([appRoutes.HOME]);
  }

  public routeToCheckout(){
    this.hideCart();
    this.router.navigate([appRoutes.CHECKOUT]);
  }

  public removeItemFromCart(cartId: number, index: number) {
    this.objCOnfirmationUtil
      .getConfirmation(
        getDefaultConfirmationModalData('Remove item', 'Are you sure you want to remove this item?')
      )
      .then((res: boolean) => {
        if (res) {
          if (this.utilService.isUserLoggedIn()) {
            httpDelete<IRGeneric<boolean>>(ApiRoutes.CART.DELETE_ITEM_FROM_CART(cartId)).subscribe({
              next: (res) => {
                if (res?.data) {
                  this.cartService.cartData.update((currentCart) =>
                    currentCart.filter((item) => item.cartId !== cartId)
                  );

                  this.toastService.show({
                    message: 'Product removed',
                    type: EToastType.success,
                    duration: 2000,
                  });
                }
              },
            });
          } else {
            this.cartService.cartData.update((currentCart) =>
              currentCart.filter((item, prodIndex) => prodIndex !== index)
            );
            setLocalStorageItem(LocalStorageEnum.cartList, this.cartService.cartData());
            this.toastService.show({
              message: 'Product removed',
              type: EToastType.success,
              duration: 2000,
            });
          }
        }
      });
  }
}
