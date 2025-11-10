import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RNewArrivals } from '../../core/interface/response/newArrival.response';

@Component({
  selector: 'app-new-arrival-product-card',
  imports: [],
  templateUrl: './new-arrival-product-card.html',
  styleUrl: './new-arrival-product-card.scss',
})
export class NewArrivalProductCard {

  @Input() product: RNewArrivals = { name: '', price: 0, wishList: false };
  @Output() addButtonPressed: EventEmitter<null> = new EventEmitter<null>();
  // @Output() wishListButtonPressed: EventEmitter = new EventEmitter();
  

  constructor(){
    // this.addButtonPressed.emit
  }

  public addProduct(){
    this.addButtonPressed.emit();
  }
}
