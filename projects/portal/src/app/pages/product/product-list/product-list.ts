import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { Base } from '@portal/core';
import { initializePagInationPayload } from '../../../core/interface/request/genericPayload';
import { IProductPagination } from '../../../core/interface/request/product.request';
import { IGenericResponse } from '../../../core/interface/response/genericResponse';

import { ApiRoutes, EToastType, IRGeneric, MConfirmationModalData, ToastService } from '@shared';
import { IProduct, IProductResponseRoot } from '../../../core/interface/response/product.response';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList extends Base implements OnInit {
  public readonly dialog = inject(MatDialog);
  public payLoad: IProductPagination = {
    ...initializePagInationPayload(),
    categoryId: null,
    gender: null,
  };

  public productList: WritableSignal<IProduct[]> = signal([]);

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  constructor(private router: Router, private toaster: ToastService) {
    super();
    this.getProductData();
  }

  // Product List
  public getProductData() {
    this.httpPostPromise<IRGeneric<IProductResponseRoot>, IProductPagination>(
      ApiRoutes.PRODUCT.ALL,
      this.payLoad
    ).then((response) => {
      if (response?.data) {
        this.productList.set(response.data.products);
      } else {
        this.productList.set([]);
      }
    });
  }

  public routeToUpsertPage(productId: number) {
    this.router.navigate([this.appRoutes.PRODUCT_UPSERT], {
      queryParams: {
        id: productId,
      },
    });
  }

  // Delete Product
  public deleteProduct(id: number) {
    if (id) {
      const modalData: MConfirmationModalData = {
        heading: 'Confirm Delete',
        body: 'Are you sure you want to delete this Product?',
        yesText: 'Yes',
        noText: 'No'
      };

      this.objConfirmationUtil.getConfirmation(modalData).then((res: boolean) => {
        if (res) {
          this.httpDeletePromise<IGenericResponse<boolean>>(ApiRoutes.PRODUCT.GETBYID(id))
            .then(response => {
              if (response.data) {
                this.toaster.show({
                  message: 'Product deleted successfully',
                  duration: 3000,
                  type: EToastType.success
                });
                this.getProductData();
              }
            })
            .catch((error) => {
            });
        }
      })
    }
  }
}




