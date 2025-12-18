import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnInit, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MConfirmationModalData } from '@shared';
import { appRoutes, RNewArrivals, UtilityService, WishlistService } from '@website/core';

@Component({
  selector: 'app-new-arrival-product-card',
  imports: [CommonModule],
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
    color: []
  };
  @Output() addButtonPressed: EventEmitter<null> = new EventEmitter<null>();

  constructor(
    private router: Router,
    private utilService: UtilityService,
    public wishlistService: WishlistService
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
  }
}
