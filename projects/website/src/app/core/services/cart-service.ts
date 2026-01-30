import {
  computed,
  effect,
  EventEmitter,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CartVariant, IRCartRoot } from '../../components/shopping-cart/shopping-cart.model';
import {
  ApiRoutes,
  ConfirmationUtil,
  EToastType,
  getDefaultConfirmationModalData,
  getLocalStorageItem,
  httpDelete,
  httpGet,
  httpPost,
  IRGeneric,
  setLocalStorageItem,
  ToastService,
} from '@shared';
import { UtilityService } from './utility-service';
import { LocalStorageEnum } from '../enum/local-storage.enum';
import { ICartFormData } from '../../pages/product-detail/product-detail.model';
import { CartUpdateOperation } from '../enum/cart.enum';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // if qty contains value means quantity is updated directly, but if it null quantity is increased by '+' or  '-' sign
  public eventCartDataUpdated: EventEmitter<{
    operation: CartUpdateOperation;
    index: number;
  }> = new EventEmitter();

  public cartData: WritableSignal<IRCartRoot[]> = signal([]);
  public cartCount = computed(() => this.cartData().length);
  public cartTotalMrp: Signal<number> = computed(() => {
    return this.cartData().reduce((total, item) => total + item.mrp * item.cartQuantity, 0);
  });

  private objCOnfirmationUtil: ConfirmationUtil = new ConfirmationUtil();
  private toastService: ToastService = inject(ToastService);

  constructor(private utilService: UtilityService) {
    effect(() => {});

    this.getCartProduct();
  }

  public getCartProduct() {
    const promise = new Promise((resolve, reject) => {
      if (this.utilService.isUserLoggedIn()) {
        httpGet<IRGeneric<IRCartRoot[]>>(ApiRoutes.CART.GET).subscribe({
          next: (res) => {
            if (res?.data) {
              this.cartData.set(
                res.data.map((x) => {
                  return {
                    ...x,
                    _isDisable: false,
                  };
                }),
              );
            } else {
              this.cartData.set([]);
            }
            resolve(true);
          },
          error: (err) => {
            reject(err);
          },
        });
      } else {
        const cartList: IRCartRoot[] =
          getLocalStorageItem<IRCartRoot[]>(LocalStorageEnum.cartList) ?? [];

        this.cartData.set(
          cartList.map((x) => {
            return {
              ...x,
              _isDisable: false,
            };
          }),
        );

        resolve(true);
      }
    });

    return promise;
  }

  public getProductQty(stockId: number): number {
    const existingProductIndex = this.cartData().findIndex((item) => item.stockId === stockId);

    if (existingProductIndex > -1) {
      return this.cartData()[existingProductIndex].cartQuantity;
    }

    return 0;
  }

  public addProductInData(product: IRCartRoot) {
    this.cartData.update((currentData) => {
      // 1. Find the index of the existing product that matches both stockId and variantId
      const existingProductIndex = currentData.findIndex(
        (item) => item.stockId === product.stockId,
      );

      // debugger
      // 2. If the product is found (Index >= 0)
      if (existingProductIndex > -1) {
        // Get the current item
        const existingItem = currentData[existingProductIndex];

        // Check if the user is already at max stock quantity
        if (existingItem.cartQuantity >= product.stockQuantity) {
          this.toastService.show({
            message: 'You are already at max stock quantity',
            type: EToastType.warning,
            duration: 3000,
          });
          return currentData; // Return unchanged data
        }

        // Check if the new quantity would exceed stock quantity
        if (product.cartQuantity > product.stockQuantity) {
          // Calculate remaining quantity that can be added
          const remainingQty = product.stockQuantity - existingItem.cartQuantity;
          this.toastService.show({
            message: `Only ${remainingQty} qty can be added because max limit will be reached`,
            type: EToastType.warning,
            duration: 3000,
          });

          // Set the quantity to maximum allowed instead of rejecting completely
          const maxAllowedQuantity = product.stockQuantity;
          const updatedItem = this.updateIRCartRoot(existingItem, maxAllowedQuantity);

          const newData = [
            ...currentData.slice(0, existingProductIndex),
            updatedItem,
            ...currentData.slice(existingProductIndex + 1),
          ];

          return newData;
        }

        // Calculate the new total quantity
        const newQuantity = product.cartQuantity;

        // Create a new, updated item (IMMUTABILITY!)
        const updatedItem = this.updateIRCartRoot(existingItem, newQuantity);

        // Create a new array by slicing, replacing the old item, and spreading the rest
        const newData = [
          ...currentData.slice(0, existingProductIndex), // Items before the updated one
          updatedItem, // The newly created (updated) item
          ...currentData.slice(existingProductIndex + 1), // Items after the updated one
        ];

        this.toastService.show({
          message: 'Cart Updated',
          type: EToastType.success,
          duration: 2000,
        });
        return newData; // Return the NEW array reference
      }
      // 3. If the product is NOT found
      else {
        // Check if the new product quantity exceeds stock quantity
        if (product.cartQuantity > product.stockQuantity) {
          this.toastService.show({
            message: `Only ${product.stockQuantity} qty available in stock`,
            type: EToastType.warning,
            duration: 3000,
          });

          // Add the product with maximum available quantity instead of rejecting
          const adjustedProduct = { ...product, cartQuantity: product.stockQuantity };
          return [...currentData, adjustedProduct];
        }

        // Add the new product to the list (IMMUTABILITY!)
        this.toastService.show({
          message: 'Cart Updated',
          type: EToastType.success,
          duration: 2000,
        });
        return [...currentData, product]; // Return a NEW array with the new product added
      }
    });

    if (!this.utilService.isUserLoggedIn()) {
      setLocalStorageItem(LocalStorageEnum.cartList, this.cartData());
    }
  }

  public addLocalStorageCartToDb() {
    if (this.cartData().length) {
      this.addProductArrToCart();
    } else {
      this.getCartProduct();
    }
  }

  private addProductArrToCart() {
    let localStorageProd: Array<ICartFormData> = [];

    localStorageProd = this.cartData().map((data) => {
      const { stockId, cartVariant, cartQuantity } = data;

      return {
        stockId: stockId,
        // variantId: cartVariant.variantId,
        quantity: cartQuantity,
      } as ICartFormData;
    });

    httpPost<IRGeneric<IRCartRoot[]>, Array<ICartFormData>>(
      ApiRoutes.PRODUCT.CART,
      localStorageProd,
    ).subscribe({
      next: (res: IRGeneric<IRCartRoot[]>) => {
        if (res?.data && res.data.length) {
          this.cartData.set(res.data);
          localStorage.removeItem(LocalStorageEnum.cartList);
        }
      },
    });
  }

  public alterQuantityCnt(operation: CartUpdateOperation, index: number) {
    const cart = this.cartData();
    const item = cart[index];

    if (!item) return;

    // ❌ avoid decreasing when qty is already 1
    if (operation === CartUpdateOperation.decrease && item.cartQuantity === 1) {
      return;
    }

    // ❌ avoid increasing when qty would exceed stock quantity
    if (operation === CartUpdateOperation.increase && item.cartQuantity >= item.stockQuantity) {
      this.toastService.show({
        message: 'You are already at max stock quantity',
        type: EToastType.warning,
        duration: 3000,
      });
      return;
    }

    this.cartData()[index]._isDisable = true;
    const newQty =
      operation === CartUpdateOperation.increase ? item.cartQuantity + 1 : item.cartQuantity - 1; // this will now be >= 1 always

    const payload: ICartFormData = {
      // variantId: item.cartVariant?.variantId ?? null,
      stockId: item.stockId,
      quantity: newQty,
    };

    // Make API call FIRST
    this.updateCartProductQuantity(payload, index, operation);
  }

  public updateQuantity(qty: number, index: number, operation: CartUpdateOperation) {
    const cart = this.cartData();
    const item = cart[index];

    // Check if the new quantity exceeds stock quantity
    if (qty > item.stockQuantity) {
      this.toastService.show({
        message: `Only ${item.stockQuantity} qty available in stock`,
        type: EToastType.warning,
        duration: 3000,
      });
      return;
    }

    const payload: ICartFormData = {
      // variantId: item.cartVariant?.variantId ?? null,
      stockId: item.stockId,
      quantity: qty,
    };

    // Make API call FIRST
    this.updateCartProductQuantity(payload, index, operation);
  }

  public updateCartProductQuantity(
    data: ICartFormData,
    index: number,
    operation: CartUpdateOperation,
  ) {
    if (!this.utilService.isUserLoggedIn()) {
      this.updateServiceVariable(data, index);
      this.cartData()[index]._isDisable = false;
      return;
    }

    httpPost<IRGeneric<number>, ICartFormData>(ApiRoutes.CART.POST, data).subscribe({
      next: (res) => {
        if (!res?.data) return; // do nothing on failure

        // SUCCESS → Now update state
        this.updateServiceVariable(data, index);
        this.cartData()[index]._isDisable = false;
        this.eventCartDataUpdated.emit({
          operation: operation,
          index: index,
        });
      },

      error: () => {
        // On error: do nothing, don't update UI
        this.cartData()[index]._isDisable = false;
      },
    });
  }

  private updateServiceVariable(data: ICartFormData, index: number) {
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

    if (!this.utilService.isUserLoggedIn()) {
      setLocalStorageItem(LocalStorageEnum.cartList, this.cartData());
    }
  }

  // Define a helper function to create a new CartVariant object with updated quantity
  private updateCartVariant(variant: CartVariant, newQuantity: number): CartVariant {
    return {
      ...variant, // Copy all existing properties
      cartQuantity: newQuantity, // Update the specific quantity
    };
  }

  // Define a helper function to create a new IRCartRoot object with updated quantity and variant
  private updateIRCartRoot(product: IRCartRoot, newQuantity: number): IRCartRoot {
    return {
      ...product, // Copy all existing properties
      cartQuantity: newQuantity, // Update the root cartQuantity
      cartVariant: this.updateCartVariant(product.cartVariant, newQuantity), // Update the nested CartVariant
      // cartVariant: null,
    };
  }

  public removeItemFromCart(cartId: number, index: number) {
    this.objCOnfirmationUtil
      .getConfirmation(
        getDefaultConfirmationModalData(
          'Remove item',
          'Are you sure you want to remove this item?',
        ),
      )
      .then((res: boolean) => {
        if (res) {
          if (this.utilService.isUserLoggedIn()) {
            httpDelete<IRGeneric<boolean>>(ApiRoutes.CART.DELETE_ITEM_FROM_CART(cartId)).subscribe({
              next: (res) => {
                if (res?.data) {
                  this.cartData.update((currentCart) =>
                    currentCart.filter((item) => item.cartId !== cartId),
                  );

                  this.toastService.show({
                    message: 'Product removed',
                    type: EToastType.success,
                    duration: 2000,
                  });

                  this.eventCartDataUpdated.emit({ operation: CartUpdateOperation.delete, index });
                }
              },
            });
          } else {
            this.cartData.update((currentCart) =>
              currentCart.filter((item, prodIndex) => prodIndex !== index),
            );
            setLocalStorageItem(LocalStorageEnum.cartList, this.cartData());
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
