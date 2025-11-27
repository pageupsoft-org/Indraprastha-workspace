import { Component, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { appRoutes } from '../../core/const/appRoutes.const';
import {
  ApiRoutes,
  ConfirmationUtil,
  EToastType,
  httpDelete,
  httpGet,
  IRGeneric,
  ToastService,
} from '@shared';
import { IRWishlistRoot, Product } from '../../core/interface/response/wishlist.response';
import { wishlistArray } from '../../../dummy-data';


@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist {
  public readonly productDetailRoute: string = appRoutes.PRODUCT_DETAIL;
  private readonly objectCOnfirmationUtil: ConfirmationUtil = new ConfirmationUtil();
  public wishlistArray: WritableSignal<Product[]> = signal(wishlistArray.data);

  constructor(private toastService: ToastService) {}

  public addRedColorDeleteIcon(isEnter: boolean, index: number) {
    this.wishlistArray()[index].icon = isEnter
      ? 'assets/icons/delete-red.svg'
      : 'assets/icons/delete-black.svg';
  }

  public routeToProductDetail() {}

  private getWishlist() {
    httpGet<IRGeneric<IRWishlistRoot>>(ApiRoutes.WISH.GET, false).subscribe({
      next: (response) => {
        if (response?.data) {
          this.wishlistArray.set(response.data.products);
        } else {
          this.wishlistArray.set([]);
        }
      },
    });
  }

  public removeFromWishList(id: number) {
    this.objectCOnfirmationUtil.getConfirmation(null).then((res: boolean) => {
      if (res) {
        console.log('in');
        httpDelete<IRGeneric<IRWishlistRoot>>(ApiRoutes.WISH.DELETE(id), true).subscribe({
          next: (response) => {
            if (response?.data) {
              this.toastService.show({
                message: 'Item removed from wishlist successfully',
                type: EToastType.success,
                duration: 3000,
              });

              this.getWishlist();
            } else {
              this.toastService.show({
                message: response.errorMessage|| 'Failed to remove item from wishlist',
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
