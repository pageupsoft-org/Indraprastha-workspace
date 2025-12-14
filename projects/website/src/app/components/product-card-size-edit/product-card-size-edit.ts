import { Component, input, OnInit, output, signal, WritableSignal } from '@angular/core';
import { IProductCardSizeDT } from './product-card-size-edit.model';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartUpdateOperation } from '@website/core';

@Component({
  selector: 'app-product-card-size-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-card-size-edit.html',
  styleUrl: './product-card-size-edit.scss',
})
export class ProductCardSizeEdit implements OnInit {
  public prod = input.required<IProductCardSizeDT>();
  public emitDelete = output<void>();
  public alterQty = output<CartUpdateOperation>();

  public CartUpdateOperation = CartUpdateOperation;

  constructor() {}

  ngOnInit(): void {
  }

  public alterQuantityCnt(operation: CartUpdateOperation) {
    this.alterQty.emit(operation);
  }
  public removeItemFromCart() {
    this.emitDelete.emit();
  }
}
