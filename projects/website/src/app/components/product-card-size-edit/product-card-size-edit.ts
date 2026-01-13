import { Component, input, OnInit, output } from '@angular/core';
import { IProductCardSizeDT } from './product-card-size-edit.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    console.log(this.prod());
    
  }

  public isOutOfStock(): boolean {
    const prod = this.prod();
    if (!prod) return false;
    return prod.stockQuantity == 0;
  }

  public isLowStock(): boolean {
    const prod = this.prod();
    if (!prod) return false;
    return prod.stockQuantity <= 5;
  }

  public alterQuantityCnt(operation: CartUpdateOperation) {
    this.alterQty.emit(operation);
  }

  public removeItemFromCart() {
    this.emitDelete.emit();
  }
}
