import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { IRWishlistRoot, Product } from '../interface/response/wishlist.response';
import {
  ApiRoutes,
  ConfirmationUtil,
  EToastType,
  httpDelete,
  httpGet,
  IRGeneric,
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

  public addToWishlist(id: number) {}

  public removeFromWishList(id: number, index: number) {
    this.objectCOnfirmationUtil.getConfirmation(null).then((res: boolean) => {
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
                return this.wishlistProducts().filter((_, i) => i !== index);
              });
            } else {
              this.toastService.show({
                message: response.errorMessage || 'Failed to remove item from wishlist',
                type: EToastType.error,
                duration: 3000,
              });
            }
          },
        });
      }
    });
  }
}
