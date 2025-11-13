import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductSlider } from '../home/product-slider/product-slider';
import {
  ApiRoutes,
  DashboardProductTypeStringEnum,
  DescriptionTypeStringEnum,
  EStockSize,
  EToastType,
  httpGet,
  httpPost,
  IRGeneric,
  jsonToArray,
  MStringEnumToArray,
  stringEnumToArray,
  ToastService,
} from '@shared';
import {
  initializeIRProductDetailRoot,
  IRProductDetailRoot,
} from '../../core/interface/response/product.response';
import { ActivatedRoute, Params } from '@angular/router';
import { dummyProductDetail } from '../../../dummy-data';
import { ICartForm, IStockWithIds } from './product-detail.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartUpdateOperation } from '../../core/enum/cart.enum';
import { UtilityService } from '../../core/services/utility-service';

@Component({
  selector: 'app-product-detail',
  imports: [ProductSlider, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  public readonly DescriptionTypeStringEnum = DescriptionTypeStringEnum;
  public readonly CartAlterEnum = CartUpdateOperation;
  public productDetail: WritableSignal<IRProductDetailRoot> = signal(
    initializeIRProductDetailRoot()
  );

  public DashboardProductTypeStringEnum = DashboardProductTypeStringEnum;
  private readonly stockSizeArray: MStringEnumToArray[] = stringEnumToArray(EStockSize);
  public readonly stockSizeArrayWithIds: IStockWithIds[] = [];
  public cartForm: FormGroup<ICartForm> = new FormGroup<ICartForm>({
    stockId: new FormControl(null),
    variantId: new FormControl(0),
    quantity: new FormControl<number>(1),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private utilService: UtilityService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((param: Params) => {
      if (param && param['id']) {
        this.getData(+param['id']);
      }
    });
  }
  trackByStockId(index: number, item: any) {
    return item.stockId;
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

  public enlargeImage(img: string) {
    this.productDetail().activeImage = img;
  }

  public addToCart() {
    if (this.utilService.isUserLoggedIn()) {
      // user is logged in make api call to save in db
      httpPost<IRGeneric<number>, Partial<ICartForm>>(
        ApiRoutes.CART.POST,
        this.cartForm.value as Partial<ICartForm>
      ).subscribe({
        next: (res) => {
          if (res?.data) {
            this.toastService.show({
              message: 'Added to Cart',
              type: EToastType.success,
              duration: 3000,
            });
          } else {
            this.toastService.show({
              message: res.errorMessage,
              type: EToastType.error,
              duration: 3000,
            });
          }
        },
      });
    } else {
      // use localstorage
    }
  }

  private getData(productId: number) {
    httpGet<IRGeneric<IRProductDetailRoot>>(ApiRoutes.PRODUCT.GET_BY_ID(productId), true).subscribe(
      {
        next: (res: IRGeneric<IRProductDetailRoot>) => {
          if (res?.data) {
            this.productDetail.set(res.data);
            this.productDetail().activeImage = this.productDetail().productURL.at(0) ?? '';
            // format json text
            this.productDetail().descriptions.forEach((pd) => {
              // 1. Initialize pd.jsonText if it's undefined AND CLEAR the array if it already exists.
              if (!pd.jsonText || pd.jsonText.length > 0) {
                // Correctly initialize or reset the array to prevent duplication
                pd.jsonText = [];
              }

              if (pd.descriptionType === DescriptionTypeStringEnum.Json) {
                // Explicit type is good, keeps TypeScript happy
                let keyValJsonText: { key: string; value: string }[] = [];

                try {
                  if (typeof pd.description === 'string' && pd.description.length > 0) {
                    // Assume jsonToArray is correctly implemented
                    keyValJsonText = jsonToArray(JSON.parse(pd.description));
                  }
                } catch (e) {
                  console.error('Error parsing JSON description:', pd.description, e);
                }

                // 3. Push the converted items into the now-empty array
                keyValJsonText.forEach((kv) => {
                  pd.jsonText.push(kv);
                });
              }
            });

            this.stockSizeArray.forEach((ssd) => {
              const stock = this.productDetail().stocks.find((x) => x.size == ssd.key);
              let newStockWithIds: IStockWithIds = {
                key: ssd.key,
                value: ssd.value,
                stockId: 0,
                productId: 0,
                quantity: 0,
              };

              if (stock) {
                const { id, productId, quantity } = stock;
                newStockWithIds.stockId = id;
                newStockWithIds.productId = productId;
                newStockWithIds.quantity = quantity;
              }

              this.stockSizeArrayWithIds.push(newStockWithIds);
            });
          } else {
            // this.productDetail.set(initializeIRProductDetailRoot());
          }
        },
      }
    );
  }
}
