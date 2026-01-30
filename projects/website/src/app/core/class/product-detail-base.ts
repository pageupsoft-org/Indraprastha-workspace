import { computed, inject, signal, WritableSignal } from '@angular/core';
// import {
//   initializeIRProductDetailRoot,
//   IRProductDetailRoot,
// } from '../interface/response/product.response';
import {
  ApiRoutes,
  ConfirmationUtil,
  EDescriptionType,
  EStockSize,
  EStockSizeName,
  EToastType,
  httpPost,
  initializeIRProductDetailRoot,
  IRGeneric,
  IRProductDetailRoot,
  jsonToArray,
  MConfirmationModalData,
  MStringEnumToArray,
  stringEnumToArray,
  ToastService,
} from '@shared';

import {
  ICartForm,
  IProductInfoPayload,
  IQueryToCheckout,
  IStockWithIds,
} from '../../pages/product-detail/product-detail.model';
import { UtilityService } from '../services/utility-service';
import { FormControl, FormGroup } from '@angular/forms';
import { CartService } from '../services/cart-service';
import { defaultIRCartRoot, IRCartRoot } from '../../components/shopping-cart/shopping-cart.model';
import { Product } from '../../pages/home/product-slider/dashboard.response';
import { CartUpdateOperation } from '../enum/cart.enum';
import { appRoutes } from '../const/appRoutes.const';
import { Router } from '@angular/router';
import { ApiCallService } from '../services/api-call-service';
import { RCustomTailoredCombo } from '../interface/response/tailor.response';

export class ProductDetailBase {
  public isShowloader: WritableSignal<boolean> = signal(false);
  public isBtnLoader: WritableSignal<boolean> = signal(false);
  // public isProductValid: WritableSignal<boolean> = signal(true);
  public isProductNotFound: WritableSignal<boolean> = signal(false);
  public cartForm: FormGroup<ICartForm> = new FormGroup<ICartForm>({
    stockId: new FormControl(null),
    quantity: new FormControl<number>(1),
    _colorVarintId: new FormControl<number>(1),
    tailorId: new FormControl(null),
    variantId: new FormControl(null),
  });
  private readonly stockSizeArray: MStringEnumToArray[] = stringEnumToArray(EStockSize);
  // public readonly stockSizeArrayWithIds: IStockWithIds[] = [];
  public stockSizeArrayWithIds: WritableSignal<IStockWithIds[]> = signal([]);
  public customTailorCombo: WritableSignal<RCustomTailoredCombo[]> = signal([]);

  public productDetail: WritableSignal<IRProductDetailRoot> = signal(
    initializeIRProductDetailRoot(),
  );
  public relatedproductList = signal<Product[]>([]);

  private productInfoPayload: IProductInfoPayload = {
    id: 0,
    isRelatedItem: false,
  };

  public readonly objectCOnfirmationUtil: ConfirmationUtil = new ConfirmationUtil();

  //#region Dependency Injection
  public utilService: UtilityService = inject(UtilityService);
  public router: Router = inject(Router);
  public toastService: ToastService = inject(ToastService);
  public cartService: CartService = inject(CartService);
  public apiCallService: ApiCallService = inject(ApiCallService);
  //#endregion

  constructor() {
    this.getCustomTailorCombo();

    this.cartForm.controls.variantId.valueChanges.subscribe(() => {
      this.cartForm.controls.tailorId.setValue(null);
    });
  }

  public getProductDetail(productId: number) {
    this.isShowloader.set(true);
    this.productInfoPayload.id = productId;
    this.stockSizeArrayWithIds.update(() => []);
    httpPost<IRGeneric<IRProductDetailRoot>, IProductInfoPayload>(
      ApiRoutes.PRODUCT.DETAIL_INFO,
      this.productInfoPayload,
      true,
    ).subscribe({
      next: (res: IRGeneric<IRProductDetailRoot>) => {
        if (res?.data) {
          this.productDetail.set(res.data);
          // console.log(this.productDetail());

          this.productDetail.update((oldVal) => {
            if (!oldVal) return oldVal;

            const urls = oldVal.colorVariants?.at(0)?.colorVariantURL ?? [];

            return {
              ...oldVal,
              _productURL: urls,
              _activeImage: urls.at(0) ?? '',
            };
          });

          // format json text
          this.productDetail().descriptions.forEach((pd) => {
            // 1. Initialize pd.jsonText if it's undefined AND CLEAR the array if it already exists.
            if (!pd.jsonText || pd.jsonText.length > 0) {
              // Correctly initialize or reset the array to prevent duplication
              pd.jsonText = [];
            }

            if (pd.descriptionType === EDescriptionType.Json) {
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

          this.relatedproductList.set(
            this.productDetail().relatedProducts.map((rp) => ({
              id: rp.id,
              productURL: [rp.productURL],
              name: rp.productName,
              color: [],
              sizes: [],
              mrp: rp.mrp,
              gender: '',
              isWishList: rp?.isWishList,
            })),
          );

          this.stockSizeArray.forEach((ssd) => {
            // const stock = this.productDetail().stocks.find((x) => x.size == ssd.key);
            const colorVariantStock = this.productDetail()
              .colorVariants.at(0)
              ?.stocks.find((x) => x.size == ssd.key);
            let newStockWithIds: IStockWithIds = {
              key: ssd.key,
              value:
                ssd.key === EStockSize.CustomSize
                  ? EStockSizeName[EStockSize.CustomSize]
                  : ssd.value,
              stockId: 0,
              productId: 0,
              quantity: 0,
              colorVariantId: 0,
            };
            // debugger

            if (colorVariantStock) {
              const { id, productId, quantity, colorVariantId } = colorVariantStock;
              newStockWithIds.stockId = id;
              newStockWithIds.productId = productId;
              newStockWithIds.quantity = quantity;
              newStockWithIds.colorVariantId = colorVariantId;
            }

            // this.stockSizeArrayWithIds.push(newStockWithIds);
            this.stockSizeArrayWithIds.update((oldVal) => {
              return [...oldVal, newStockWithIds];
            });
          });

          this.stockSizeArrayWithIds.update((oldVal) => {
            return oldVal.filter((stk) => stk.quantity);
          });

          this.cartForm.controls.stockId.setValue(this.stockSizeArrayWithIds()[0].stockId);
          this.cartForm.controls.variantId.setValue(
            this.productDetail().variants.at(0)?.id ?? null,
          );
          this.cartForm.controls._colorVarintId.setValue(
            this.stockSizeArrayWithIds()[0].colorVariantId,
          );
        } else {
          this.productDetail.set(initializeIRProductDetailRoot());
          this.isProductNotFound.update(() => true);
        }
        this.isShowloader.set(false);
      },
    });
  }

  public isVariantWithCustomTailor(): boolean {
    if (this.cartForm.controls.variantId.value) {
      const varint = this.productDetail().variants.find(
        (v) => v.id === this.cartForm.controls.variantId.value,
      );
      if (varint) {
        return varint.isCustom;
      }
    }

    return false;
  }

  public addToCartWithDescription(): void {
    const detail = this.productDetail();

    // check the color first
    let colorVariantId: number = this.productDetail().colorVariants.at(0)?.id ?? 0; //by default 0th index color
    let colorVariantName: string = this.productDetail().colorVariants.at(0)?.colorName ?? ''; //by default 0th index color
    let size: string = EStockSize.XS;
    let stockQty: number = 0;
    if (this.productDetail().colorVariants.length > 1) {
      for (let i = 0; i < this.productDetail().colorVariants.length; i++) {
        if (
          this.cartForm.controls._colorVarintId.value === this.productDetail().colorVariants[i].id
        ) {
          colorVariantId = this.productDetail().colorVariants[i].id;
          colorVariantName = this.productDetail().colorVariants[i].colorName;
          size =
            this.productDetail().colorVariants[i].stocks.find(
              (stock) => stock.id === this.cartForm.controls.stockId.value,
            )?.size ?? '';
          stockQty =
            this.productDetail().colorVariants[i].stocks.find(
              (stock) => stock.id === this.cartForm.controls.stockId.value,
            )?.quantity ?? 0;
          break;
        }
      }
    } else {
      for (let i = 0; this.stockSizeArrayWithIds().length; i++) {
        if (this.stockSizeArrayWithIds()[i].stockId === this.cartForm.controls.stockId.value) {
          stockQty = this.stockSizeArrayWithIds()[i].quantity;
          break;
        }
      }
    }

    const newProduct: IRCartRoot = {
      name: detail.name,
      color: colorVariantName,
      mrp: detail.mrp,
      gender: detail.gender,
      productURL: detail._productURL,
      stockId: this.cartForm.controls.stockId.value ?? 0,
      size: size,
      stockQuantity: stockQty ?? 0, //actual stock quantity
      cartQuantity: 1, //quantity present in cart
      cartId: 0,
      productId: detail.id,
      cartVariant: {
        name: '',
        mrp: 0,
        // variantURL: '',
        // stockId: 0, // Adjust if stocks in variant is an object
        stockQuantity: 0,
        cartQuantity: 1,
        variantId: 0,
      },
      // cartVariant: null,
      _isDisable: false,
      colorVariantId: colorVariantId,
    };

    if (this.cartForm.controls.variantId.value) {
      const variant = this.productDetail().variants.find(
        (v) => v.id === this.cartForm.controls.variantId.value,
      );
      if (variant) {
        newProduct.cartVariant = {
          ...newProduct.cartVariant,
          name: variant.name,
          variantId: variant.id,
          mrp: variant.mrp,
        };
      }
    }

    console.log(this.cartForm.value);

    this.addToCart(newProduct);
  }

  public addToCart(product: IRCartRoot) {
    const newAdded: IRCartRoot = defaultIRCartRoot();
    newAdded.stockId = this.cartForm.controls.stockId.value ?? 0;
    newAdded.cartQuantity = this.cartForm.controls.quantity.value ?? 0;

    const preQty: number = this.cartService.getProductQty(this.cartForm.value.stockId ?? 0);

    product.stockId = newAdded.stockId;
    product.cartQuantity = newAdded.cartQuantity + preQty;

    if (this.utilService.isUserLoggedIn()) {
      this.isBtnLoader.set(true);
      // user is logged in make api call to save in db
      const formData = { ...this.cartForm.value };
      formData.quantity = preQty + (formData.quantity ?? 0);

      formData._colorVarintId = undefined;

      httpPost<IRGeneric<number>, Partial<ICartForm>>(
        ApiRoutes.CART.POST,
        formData as Partial<ICartForm>,
      ).subscribe({
        next: (res) => {
          if (res?.data) {
            this.toastService.show({
              message: 'Added to Cart',
              type: EToastType.success,
              duration: 3000,
            });

            // this.cartService.addProductInData(newAdded);
            this.cartService.addProductInData(product);
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
      product.cartQuantity = newAdded.cartQuantity + preQty;
      this.cartService.addProductInData(product);

      // this.toastService.show({
      //   message: 'Cart Updated',
      //   type: EToastType.success,
      //   duration: 2000,
      // });
    }
  }

  // public getStockQuantity(stockId: number): number {
  //   const variant = this.productDetail().variants.find((variant) => variant.stocks.id === stockId);
  //   return variant?.stocks.quantity ?? 0;
  // }

  public alterQuantityCnt(operation: CartUpdateOperation) {
    const quantity = this.cartForm.controls.quantity.value ?? 0;
    const selectedStockId = this.cartForm.controls.stockId.value ?? 0;
    const selectedStock = this.stockSizeArrayWithIds().find(
      (stock) => stock.stockId === selectedStockId,
    );
    const availableStock = selectedStock?.quantity ?? 0;

    if (operation === CartUpdateOperation.increase) {
      if (quantity >= availableStock) {
        this.toastService.show({
          message: `Only ${availableStock} items available in stock`,
          type: EToastType.info,
          duration: 2000,
        });
      } else if (quantity >= 5) {
        this.toastService.show({
          message: 'Cannot order more than five quantity',
          type: EToastType.info,
          duration: 2000,
        });
      } else {
        this.cartForm.controls.quantity.setValue(quantity + 1);
      }
    } else {
      if (quantity > 1) {
        this.cartForm.controls.quantity.setValue(quantity - 1);
      }
    }
  }

  public buyNow() {
    if (this.utilService.isUserLoggedIn()) {
      const color: string =
        this.productDetail().colorVariants.find(
          (cv) => cv.id == this.cartForm.controls._colorVarintId.value,
        )?.colorName ?? '';
      const payload: IQueryToCheckout = {
        id: this.productDetail().id,
        name: this.productDetail().name,
        price: this.productDetail().mrp,
        color: color,
        colorId: this.cartForm.controls._colorVarintId.value ?? 0,
        size:
          this.stockSizeArrayWithIds().find(
            (val) => val.stockId == this.cartForm.controls.stockId.value,
          )?.value ?? '',
        qty: this.cartForm.controls.quantity.value ?? 0,
        stockQty:
          this.stockSizeArrayWithIds().find(
            (val) => val.stockId == this.cartForm.controls.stockId.value,
          )?.quantity ?? 0,
        stockId: this.cartForm.controls.stockId.value ?? 0,
        variantId: this.cartForm.controls.variantId.value ?? 0,
        variantName:
          this.productDetail().variants.find((v) => v.id === this.cartForm.controls.variantId.value)
            ?.name ?? '',
      };

      this.router.navigate([appRoutes.CHECKOUT], {
        queryParams: {
          buy_now: true,
          data: JSON.stringify(payload),
        },
      });
    } else {
      const confirmation_model: MConfirmationModalData = {
        heading: 'Login Needed',
        body: 'Please login first to buy this item.',
        noText: 'Cancel',
        yesText: 'Sure',
      };
      this.objectCOnfirmationUtil.getConfirmation(confirmation_model).then((res: boolean) => {
        if (res) {
          this.utilService.openLoginForm.emit();
        }
      });
    }
  }

  public updateOnColorChange(colorVariantIndex: number) {
    this.cartForm.controls.stockId.setValue(null);
    this.cartForm.controls.quantity.setValue(1);
    this.productDetail.update((oldVal) => {
      if (!oldVal) return oldVal;

      const urls = oldVal.colorVariants?.at(colorVariantIndex)?.colorVariantURL ?? [];

      return {
        ...oldVal,
        _productURL: urls,
        _activeImage: urls.at(colorVariantIndex) ?? '',
      };
    });

    this.stockSizeArrayWithIds.update(() => []);
    this.stockSizeArray.forEach((ssd) => {
      const colorVariantStock = this.productDetail()
        .colorVariants.at(colorVariantIndex)
        ?.stocks.find((x) => x.size == ssd.key);
      let newStockWithIds: IStockWithIds = {
        key: ssd.key,
        value: ssd.value,
        stockId: 0,
        productId: 0,
        quantity: 0,
        colorVariantId: 0,
      };

      if (colorVariantStock) {
        const { id, productId, quantity, colorVariantId } = colorVariantStock;
        newStockWithIds.stockId = id;
        newStockWithIds.productId = productId;
        newStockWithIds.quantity = quantity;
        newStockWithIds.colorVariantId = colorVariantId;
      }

      this.stockSizeArrayWithIds.update((oldVal) => {
        return [...oldVal, newStockWithIds];
      });
    });

    this.stockSizeArrayWithIds.update((oldVal) => {
      return oldVal.filter((stk) => stk.quantity);
    });

    this.cartForm.controls._colorVarintId.setValue(this.stockSizeArrayWithIds()[0].colorVariantId);
    this.cartForm.controls.stockId.setValue(this.stockSizeArrayWithIds()[0].stockId);
  }

  public onSizeChange() {
    // Reset quantity to 1 when size changes
    this.cartForm.controls.quantity.setValue(1);
  }

  private getCustomTailorCombo() {
    this.apiCallService.getCustomTailorCombo().subscribe({
      next: (res: IRGeneric<RCustomTailoredCombo[]>) => {
        if (res.data && res.data.length) {
          this.customTailorCombo.set(res.data);
        } else {
          this.customTailorCombo.set([]);
        }
      },
      error: (err) => {
        this.customTailorCombo.set([]);
      },
    });
  }

  // public isCartBuyNowDisabled(): boolean {
  //   const stockId = this.cartForm.controls.stockId.value;
  //   const tailorId = this.cartForm.controls.tailorId.value;

  //   // ❌ No stock selected
  //   if (!stockId) {
  //     return true;
  //   }

  //   const stockList = this.stockSizeArrayWithIds();

  //   const selectedStock = stockList.find((stk) => stk.stockId === stockId);

  //   // ❌ Stock not found (safety)
  //   if (!selectedStock) {
  //     return true;
  //   }

  //   // ✅ Normal size → ENABLE
  //   if (selectedStock.key != EStockSize.CustomSize) {
  //     return false;
  //   }

  //   // 🧵 Custom size → Tailor REQUIRED
  //   return !tailorId;
  // }

  public isCartBuyNowDisabled(): boolean {
    const stockId = this.cartForm.controls.stockId.value;
    const tailorId = this.cartForm.controls.tailorId.value;
    const variantId = this.cartForm.controls.variantId.value;

    // 1️⃣ No stock selected → disable
    if (!stockId) {
      return true;
    }

    const stockList = this.stockSizeArrayWithIds();

    const selectedStock = stockList.find((stk) => String(stk.stockId) === String(stockId));

    // Safety guard
    if (!selectedStock) {
      return true;
    }

    // 2️⃣ If stock is CustomSize → tailor required
    if (selectedStock.key === EStockSize.CustomSize && !tailorId) {
      return true;
    }

    // 3️⃣ If variant is custom → tailor required
    if (variantId) {
      const selectedVariant = this.productDetail().variants?.find(
        (v) => String(v.id) === String(variantId),
      );

      if (selectedVariant?.isCustom && !tailorId) {
        return true;
      }
    }

    // ✅ All conditions satisfied → enable
    return false;
  }
}
