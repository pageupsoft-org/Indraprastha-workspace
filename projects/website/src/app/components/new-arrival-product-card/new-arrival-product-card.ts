import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { RNewArrivals } from '../../core/interface/response/newArrival.response';

@Component({
  selector: 'app-new-arrival-product-card',
  imports: [],
  templateUrl: './new-arrival-product-card.html',
  styleUrl: './new-arrival-product-card.scss',
})
export class NewArrivalProductCard implements OnInit {
  @Input() product: RNewArrivals = { name: '', price: 0, wishList: false, imageUrl: [] };
  @Output() addButtonPressed: EventEmitter<null> = new EventEmitter<null>();

  ngOnInit(): void {
  }

  public addProduct() {
    this.addButtonPressed.emit();
  }
}
