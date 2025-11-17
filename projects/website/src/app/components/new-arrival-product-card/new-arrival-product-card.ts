import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { RNewArrivals } from '../../core/interface/response/newArrival.response';
import { Router } from '@angular/router';
import { appRoutes } from '../../core/const/appRoutes.const';

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

  constructor(private router: Router) {}

  ngOnInit(): void {}

  public addProduct() {
    this.addButtonPressed.emit();
  }

  public navigateToProductDetail() {
    this.router.navigate([appRoutes.PRODUCT_DETAIL], {
      queryParams: {
        id: this.product.productId,
      },
    });
  }
}
