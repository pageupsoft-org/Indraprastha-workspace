import { computed, effect, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { CartVariant, IRCartRoot } from '../../components/shopping-cart/shopping-cart.model';
import { ApiRoutes, getLocalStorageItem, httpGet, IRGeneric, setLocalStorageItem } from '@shared';
import { UtilityService } from './utility-service';
import { LocalStorageEnum } from '../enum/local-storage.enum';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public cartData: WritableSignal<IRCartRoot[]> = signal([]);
  public cartCount = computed(() => this.cartData().length);
  public cartTotalMrp: Signal<number> = computed(() => {
    return this.cartData().reduce((total, item) => total + item.mrp * item.cartQuantity, 0);
  });

  constructor(private utilService: UtilityService) {
    effect(() => {
      console.log('Cart count : ', this.cartCount());
      console.log('Cart data : ', this.cartData());
      console.log('Cart count : ', this.cartCount());
    });

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
                })
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
          })
        );

        resolve(true);
      }
    });

    return promise;
  }

  public getProductQty(stockId: number, variantStockId: number): number {
    const existingProductIndex = this.cartData().findIndex(
      (item) => item.stockId === stockId && (item?.cartVariant?.stockId ?? 0) === variantStockId
    );

    if (existingProductIndex > -1) {
      return this.cartData()[existingProductIndex].cartQuantity;
    }

    return 0;
  }

  public addProductInData(product: IRCartRoot) {
    this.cartData.update((currentData) => {
      // 1. Find the index of the existing product that matches both stockId and variantId
      const existingProductIndex = currentData.findIndex(
        (item) =>
          item.stockId === product.stockId &&
          (item?.cartVariant?.stockId ?? 0) === product.cartVariant.stockId
      );

      // 2. If the product is found (Index >= 0)
      if (existingProductIndex > -1) {
        // Get the current item
        const existingItem = currentData[existingProductIndex];

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

        return newData; // Return the NEW array reference
      }
      // 3. If the product is NOT found
      else {
        // Add the new product to the list (IMMUTABILITY!)
        return [...currentData, product]; // Return a NEW array with the new product added
      }
    });

    if (!this.utilService.isUserLoggedIn()) {
      setLocalStorageItem(LocalStorageEnum.cartList, this.cartData());
    }
  }

  public addLocalStorageCartToDb(){
    if(this.cartData().length){
      throw "Method not defined";
    }
    else{
      this.getCartProduct();
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
    };
  }
}
