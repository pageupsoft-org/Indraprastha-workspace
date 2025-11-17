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
  ToastService,
} from '@shared';
import { IRCartRoot } from './shopping-cart.model';
import { CartUpdateOperation } from '../../core/enum/cart.enum';
import { CurrencyPipe, NgClass } from '@angular/common';
import { UtilityService } from '../../core/services/utility-service';
import { ICartFormData } from '../../pages/product-detail/product-detail.model';

@Component({
  selector: 'app-shopping-cart',
  imports: [Loader, CurrencyPipe, NgClass],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCart {
  cart = viewChild<ElementRef>('shoppingCart');
  cartOverlay = viewChild<ElementRef>('cartOverlay');

  public showLoader: WritableSignal<boolean> = signal(false);
  public cartData: WritableSignal<IRCartRoot[]> = signal([]);
  private objCOnfirmationUtil: ConfirmationUtil = new ConfirmationUtil();

  public CartUpdateOperation = CartUpdateOperation;
  public cartTotalMrp: Signal<number> = computed(() => {
    return this.cartData().reduce((total, item) => total + item.mrp * item.cartQuantity, 0);
  });

  constructor(private utilService: UtilityService, private toastService: ToastService) {}

  public openCart() {
    this.cartOverlay()?.nativeElement.classList.remove('hidden');
    this.cart()?.nativeElement.classList.remove('translate-x-full');

    this.getData();
  }

  public hideCart() {
    this.cart()?.nativeElement.classList.add('translate-x-full');
    this.cartOverlay()?.nativeElement.classList.add('hidden');
    this.cartData.set([]);
  }
  public alterQuantityCnt(operation: CartUpdateOperation, index: number) {
    const cart = this.cartData();
    const item = cart[index];

    if (!item) return;

    // ❌ avoid decreasing when qty is already 1
    if (operation === CartUpdateOperation.decrease && item.cartQuantity === 1) {
      return;
    }

    this.cartData()[index]._isDisable = true;
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

  public updateCartProductQuantity(
    data: ICartFormData,
    index: number,
    operation: CartUpdateOperation
  ) {
    if (!this.utilService.isUserLoggedIn()) {
      // localstorage logic later
      return;
    }

    httpPost<IRGeneric<number>, ICartFormData>(ApiRoutes.CART.POST, data).subscribe({
      next: (res) => {
        if (!res?.data) return; // do nothing on failure

        // SUCCESS → Now update state
        this.cartData.update((cart) => {
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
        this.cartData()[index]._isDisable = false;
      },

      error: () => {
        // On error: do nothing, don't update UI
        this.cartData()[index]._isDisable = false;
      },
    });
  }

  private getData() {
    this.showLoader.set(true);
    httpGet<IRGeneric<IRCartRoot[]>>(ApiRoutes.CART.GET).subscribe({
      next: (res) => {
        if (res?.data) {
          // this.cartData.set(res.data);
          this.cartData.set(
            res.data.map((x) => {
              return {
                // <-- Add explicit 'return'
                ...x,
                _isDisable: false,
              }; // <-- Note the semicolon (optional, but good practice)
            })
          );
        } else {
          this.cartData.set([]);
        }
        this.showLoader.set(false);
      },

      error: (err) => {
        this.showLoader.set(false);
      },
    });
  }

  public removeItemFromCart(cartId: number) {    
    this.objCOnfirmationUtil
      .getConfirmation(getDefaultConfirmationModalData("Remove item", "Are you sure you want to remove this item?"))
      .then((res: boolean) => {
        if (res) {
          httpDelete<IRGeneric<boolean>>(ApiRoutes.CART.DELETE_ITEM_FROM_CART(cartId)).subscribe(
            {
              next: (res) => {
                if (res?.data) {
                  this.cartData.update((currentCart) =>
                    currentCart.filter((item) => item.cartId !== cartId)
                  );

                  this.toastService.show({
                    message: 'Product removed',
                    type: EToastType.success,
                    duration: 2000,
                  });
                }
              },
            }
          );
        }
      });
  }
}
