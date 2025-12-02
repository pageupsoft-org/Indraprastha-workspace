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
import { WishlistService } from '../../core/services/wishlist-service';


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
