import { inject, signal, WritableSignal } from '@angular/core';
import {
  initializeIRProductDetailRoot,
  IRProductDetailRoot,
} from '../interface/response/product.response';
import {
  ApiRoutes,
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

import { ICartForm, IStockWithIds } from '../../pages/product-detail/product-detail.model';
import { UtilityService } from '../services/utility-service';
import { FormControl, FormGroup } from '@angular/forms';
import { CartService } from '../services/cart-service';
import { defaultIRCartRoot, IRCartRoot } from '../../components/shopping-cart/shopping-cart.model';

export class ProductDetailBase {
  public isShowloader: WritableSignal<boolean> = signal(false);
  public isBtnLoader: WritableSignal<boolean> = signal(false);
  public cartForm: FormGroup<ICartForm> = new FormGroup<ICartForm>({
    stockId: new FormControl(null),
    variantStockId: new FormControl(null),
    quantity: new FormControl<number>(1),
  });
  private readonly stockSizeArray: MStringEnumToArray[] = stringEnumToArray(EStockSize);
  public readonly stockSizeArrayWithIds: IStockWithIds[] = [];

  public productDetail: WritableSignal<IRProductDetailRoot> = signal(
    initializeIRProductDetailRoot()
  );

  private utilService: UtilityService = inject(UtilityService);
  private toastService: ToastService = inject(ToastService);
  private cartService: CartService = inject(CartService);

  public getProductDetail(productId: number) {
    this.isShowloader.set(true);
    this.stockSizeArrayWithIds.splice(0, this.stockSizeArrayWithIds.length); 
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

            if(this.productDetail().variants && this.productDetail().variants.length){
              this.cartForm.controls.variantStockId.setValue(this.productDetail().variants[0].stocks.id)
            }
          } else {
            // this.productDetail.set(initializeIRProductDetailRoot());
          }
          this.isShowloader.set(false);
        },
      }
    );
  }

  public addToCartWithDescription(): void {
    const detail = this.productDetail(); 

    const newProduct: IRCartRoot = {
      name: detail.name,
      color: detail.color,
      mrp: detail.mrp,
      gender: detail.gender,
      productURL: detail.productURL,
      stockId: detail.stocks[0]?.id ?? 0,
      size: detail.stocks[0]?.size ?? '',
      stockQuantity: detail.stocks[0]?.quantity ?? 0,
      cartQuantity: 1,
      cartId: 0,
      productId: detail.id,
      cartVariant: {
        name: detail.variants[0]?.name ?? '',
        mrp: detail.variants[0]?.mrp ?? 0,
        variantURL: detail.variants[0]?.variantURL ?? '',
        stockId: detail.variants[0]?.stocks?.id ?? 0, // Adjust if stocks in variant is an object
        stockQuantity: detail.variants[0]?.stocks?.quantity ?? 0,
        cartQuantity: 1,
        variantId: detail.variants[0]?.id ?? 0,
      },
      _isDisable: false,
    };

    this.addToCart(newProduct);
  }

  public addToCart(product: IRCartRoot) {
    const newAdded: IRCartRoot = defaultIRCartRoot();
    newAdded.stockId = this.cartForm.controls.stockId.value ?? 0;
    newAdded.cartVariant.stockId = this.cartForm.controls.variantStockId.value ?? 0;
    newAdded.cartQuantity = this.cartForm.controls.quantity.value ?? 0;

    const preQty: number = this.cartService.getProductQty(
      this.cartForm.value.stockId ?? 0,
      this.cartForm.value.variantStockId ?? 0
    );

    if (this.utilService.isUserLoggedIn()) {
      this.isBtnLoader.set(true);
      // user is logged in make api call to save in db
      const formData = { ...this.cartForm.value };
      formData.quantity = preQty + (formData.quantity ?? 0);

      httpPost<IRGeneric<number>, Partial<ICartForm>>(
        ApiRoutes.CART.POST,
        formData as Partial<ICartForm>
      ).subscribe({
        next: (res) => {
          if (res?.data) {
            this.toastService.show({
              message: 'Added to Cart',
              type: EToastType.success,
              duration: 3000,
            });

            this.cartService.addProductInData(newAdded);
          } else {
            this.toastService.show({
              message: res.errorMessage,
              type: EToastType.error,
              duration: 3000,
            });
          }
          this.isBtnLoader.set(false);
        },
        error: (err) => {
          this.isBtnLoader.set(false);
        },
      });
    } else {
      // use localstorage
      product.stockId = newAdded.stockId;
      product.cartVariant.stockId = newAdded.cartVariant.stockId;
      product.cartQuantity = newAdded.cartQuantity + preQty;
      this.cartService.addProductInData(product);

      this.toastService.show({
        message: 'Cart Updated',
        type: EToastType.success,
        duration: 2000,
      });
    }
  }
}
