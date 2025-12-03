import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { appRoutes } from '../../core/const/appRoutes.const';
import { WishlistService } from '@website/core';


@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist {
  public readonly productDetailRoute: string = appRoutes.PRODUCT_DETAIL;

  constructor(public wishlistService: WishlistService) {
    wishlistService.getWishlistProduct();
  }

  public addRedColorDeleteIcon(isEnter: boolean, index: number) {
    this.wishlistService.wishlistProducts()[index].icon = isEnter
      ? 'assets/icons/delete-red.svg'
      : 'assets/icons/delete-black.svg';
  }

  public routeToProductDetail() {}

}
