import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { IRWishlistRoot, Product } from '../interface/response/wishlist.response';
import {
  ApiRoutes,
  ConfirmationUtil,
  EToastType,
  httpDelete,
  httpGet,
  httpPost,
  IRGeneric,
  MConfirmationModalData,
  ToastService,
} from '@shared';
import { UtilityService } from './utility-service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  public wishlistProducts: WritableSignal<Product[]> = signal<Product[]>([]);
  public wishlistCount = computed(() => this.wishlistProducts().length);

  public readonly objectCOnfirmationUtil: ConfirmationUtil = new ConfirmationUtil();
  public toastService: ToastService = inject(ToastService);
  public utilService: UtilityService = inject(UtilityService);

  constructor() {
    this.getWishlistProduct();
  }

  public getWishlistProduct() {
    if (this.utilService.isUserLoggedIn()) {
      httpGet<IRGeneric<IRWishlistRoot>>(ApiRoutes.WISH.GET, false).subscribe({
        next: (response) => {
          if (response?.data && response.data?.total) {
            this.wishlistProducts.set(response.data.products);
          } else {
            this.wishlistProducts.set([]);
          }
        },
      });
    }
  }

  public addToWishlist(id: number): Promise<boolean> {
    const promise = new Promise<boolean>((resolve, reject) => {
      httpPost<IRGeneric<number>, { productId: number }>(
        ApiRoutes.WISH.ADD,
        { productId: id },
        true
      ).subscribe({
        next: (response) => {
          if (response?.data) {
            this.toastService.show({
              message: 'Item added to wishlist',
              type: EToastType.success,
              duration: 3000,
            });
            resolve(true);
            this.wishlistProducts.update((currentList) => [...currentList, { id: id } as Product]);
          } else {
            this.toastService.show({
              message: response.errorMessage || 'Failed to add item to wishlist',
              type: EToastType.error,
              duration: 3000,
            });

            resolve(false);
          }
        },
        error: (error) => {
          this.toastService.show({
            message: 'Failed to add item to wishlist',
            type: EToastType.error,
            duration: 3000,
          });
          reject(error);
        },
      });
    });
    return promise;
  }

  public removeFromWishList(id: number): Promise<boolean> {
    const promise = new Promise<boolean>((resolve, reject) => {
      const modalData: MConfirmationModalData = {
        heading: 'Confirm',
        body: 'Are you sure you want to remove this item from wishlist?',
        yesText: 'Yes',
        noText: 'No',
      };
      this.objectCOnfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
        if (res) {
          httpDelete<IRGeneric<IRWishlistRoot>>(ApiRoutes.WISH.DELETE(id), true).subscribe({
            next: (response) => {
              if (response?.data) {
                this.toastService.show({
                  message: 'Item removed from wishlist successfully',
                  type: EToastType.success,
                  duration: 3000,
                });

                this.wishlistProducts.update(() => {
                  return this.wishlistProducts().filter((_) => _.id !== id);
                });
                resolve(true);
              } else {
                this.toastService.show({
                  message: response.errorMessage || 'Failed to remove item from wishlist',
                  type: EToastType.error,
                  duration: 3000,
                });
                resolve(false);
              }
            },
          });
        } else {
          resolve(false);
        }
      });
    });

    return promise;
  }
}
