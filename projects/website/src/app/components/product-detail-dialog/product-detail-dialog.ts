import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CartUpdateOperation } from '../../core/enum/cart.enum';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailBase } from '../../core/class/product-detail-base';
import { AppLoadingButton } from '@shared';
import { defaultIRCartRoot, IRCartRoot } from '../shopping-cart/shopping-cart.model';

@Component({
  selector: 'app-product-detail-dialog',
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, AppLoadingButton, FormsModule],
  templateUrl: './product-detail-dialog.html',
  styleUrl: './product-detail-dialog.scss',
})
export class ProductDetailDialog extends ProductDetailBase implements OnInit {
  public readonly CartAlterEnum = CartUpdateOperation;

  constructor(
    private dialogRef: MatDialogRef<ProductDetailDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      productId: number;
    }
  ) {
    super();
  }

  ngOnInit(): void {
    this.getProductDetail(this.data.productId);
  }

  public close() {
    this.dialogRef.close();
  }

  public alterQuantityCnt(operation: CartUpdateOperation) {
    const quantity = this.cartForm.controls.quantity.value ?? 0;

    if (operation === CartUpdateOperation.increase) {
      this.cartForm.controls.quantity.setValue(quantity + 1);
    } else {
      if (quantity > 1) {
        this.cartForm.controls.quantity.setValue(quantity - 1);
      }
    }
  }
}
