import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppLoadingButton } from '@shared';
import { ProductDetailBase, CartUpdateOperation, RNewArrivals, appRoutes } from '@website/core';
import { Router } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { IProductDetailDT } from './product-detail-dialog.model';

@Component({
  selector: 'app-product-detail-dialog',
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, AppLoadingButton, FormsModule, NgxSkeletonLoaderModule],
  templateUrl: './product-detail-dialog.html',
  styleUrl: './product-detail-dialog.scss',
})
export class ProductDetailDialog extends ProductDetailBase implements OnInit {
  public readonly CartAlterEnum = CartUpdateOperation;


  constructor(
    private dialogRef: MatDialogRef<ProductDetailDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: IProductDetailDT,
    private router: Router
  ) {
    super();
  }

  @Input() product: RNewArrivals = {
    name: '',
    price: 0,
    wishList: false,
    imageUrl: [],
    productId: 0,
    color: []
  };


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

  public navigateToProductDetail() {
    this.router.navigate([appRoutes.PRODUCT_DETAIL], {
      queryParams: {
        id: this.data.productId,
      },
    });
    this.close()
  }


}
