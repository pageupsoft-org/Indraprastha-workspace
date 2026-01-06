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
  }

  public isOutOfStock(): boolean {
    const prod = this.prod();
    if (!prod) return false;
    
    const mainOutOfStock = prod.stockQuantity === 0;
    const variantOutOfStock = prod.variant ? (prod.variant.stockQuantity === 0) : false;
    
    return mainOutOfStock || variantOutOfStock;
  }

  public isLowStock(): boolean {
    const prod = this.prod();
    if (!prod) return false;
    
    const mainStock = prod.stockQuantity;
    const variantStock = prod.variant?.stockQuantity;
    
    // Consider low stock if main product has 1-3 items or variant has 1-3 items
    const mainLowStock = mainStock > 0 && mainStock <= 3;
    const variantLowStock = variantStock !== undefined && variantStock > 0 && variantStock <= 3;
    
    return mainLowStock || variantLowStock;
  }

  public alterQuantityCnt(operation: CartUpdateOperation) {
    this.alterQty.emit(operation);
  }
  
  public removeItemFromCart() {
    this.emitDelete.emit();
  }
}
