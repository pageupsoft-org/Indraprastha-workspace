import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MConfirmationModalData } from '@shared';
import { appRoutes, RNewArrivals, UtilityService, WishlistService } from '@website/core';

@Component({
  selector: 'app-new-arrival-product-card',
  imports: [],
  templateUrl: './new-arrival-product-card.html',
  styleUrl: './new-arrival-product-card.scss',
})
export class NewArrivalProductCard implements OnInit {
  @Input() product: RNewArrivals = {
    name: '',
    price: 0,
    wishList: false,
    imageUrl: [],
    productId: 0,
  };
  @Output() addButtonPressed: EventEmitter<null> = new EventEmitter<null>();

  constructor(
    private router: Router,
    private utilService: UtilityService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {}

  public addProduct(event: any) {
    event.stopPropagation();
    this.addButtonPressed.emit();
  }

  public navigateToProductDetail() {
    this.router.navigate([appRoutes.PRODUCT_DETAIL], {
      queryParams: {
        id: this.product.productId,
      },
    });
  }

  public toggleWishList(event: any) {
    event.stopPropagation();

    this.wishlistService.toggleWishList(event, this.product, 'wishList', 'productId');

    // if (this.utilService.isUserLoggedIn()) {
    //   if (this.product.wishList) {
    //     this.wishlistService.removeFromWishList(this.product.productId).then((res: boolean) => {
    //       if (res) {
    //         this.product.wishList = false;
    //       }
    //     });
    //   } else {
    //     this.wishlistService.addToWishlist(this.product.productId).then((res: boolean) => {
    //       if (res) {
    //         this.product.wishList = true;
    //       }
    //     });
    //   }
    // } else {
    //   const modalData: MConfirmationModalData = {
    //     heading: 'Login',
    //     body: 'To add items to your wishlist, please login first.',
    //     yesText: 'Yes',
    //     noText: 'No',
    //   };
    //   this.wishlistService.objectCOnfirmationUtil
    //     .getConfirmation(modalData)
    //     .then((res: boolean) => {
    //       if (res) {
    //         this.utilService.openLoginForm.emit();
    //       }
    //     });
    // }
  }
}
