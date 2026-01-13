import { Component, computed, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ICheckoutForm,
  ICreateOrder,
  initializeICheckoutForm,
  initializeResponseCheckout,
  IProductInfo,
  IResponseCheckout,
  Product,
} from './checkout.model';
import {
  ApiRoutes,
  EToastType,
  httpGet,
  httpPost,
  IRGeneric,
  PlatformService,
  AppLoadingButton,
  IRProductDetailRoot,
} from '@shared';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { appRoutes, CartUpdateOperation, ProductDetailBase } from '@website/core';
import {
  initializeIQueryToCheckout,
  IQueryToCheckout,
} from '../product-detail/product-detail.model';
import { AddressUpsertDialog } from '../../components/header/profile/address-upsert-dialog/address-upsert-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ProductCardSizeEdit } from '../../components/product-card-size-edit/product-card-size-edit';
import { IProductCardSizeDT } from '../../components/product-card-size-edit/product-card-size-edit.model';
import { finalize } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-checkout',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ProductCardSizeEdit,
    NgxSkeletonLoaderModule,
    AppLoadingButton,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout extends ProductDetailBase implements OnInit {
  public CartUpdateOperation = CartUpdateOperation;

  public checkoutForm: FormGroup<ICheckoutForm> = initializeICheckoutForm();
  public checkoutData: WritableSignal<IResponseCheckout> = signal(initializeResponseCheckout());

  public isRedirectedFromBuyNow = signal(false);
  public isViewAllAddress = signal(false);

  public selectedAddress = new FormControl<number | null>(null);

  public productDataFromQuery: WritableSignal<IQueryToCheckout> = signal(
    initializeIQueryToCheckout(),
  );

  /* ---------------------------------------------
   * ✅ PRODUCT VALIDATION (PURE COMPUTED)
   * --------------------------------------------- */
  public isProductValid = computed(() => {
    // 🔴 product itself not found
    if (this.isProductNotFound()) return false;

    const pd = this.productDetail();
    const query = this.productDataFromQuery();

    // ⏳ wait for API response
    if (!pd?.id) return true;

    // 📦 stock validation
    const stockValid = pd.colorVariants.some((s) =>
      s.stocks.some((stk) => stk.id == query.stockId),
    );
    if (!stockValid) return false;
    return true;
  });

  /* ---------------------------------------------
   * ✅ TOTAL AMOUNT
   * --------------------------------------------- */
  public total = computed(() => {
    return this.checkoutData().products.reduce((sum, pd) => {
      sum += pd.mrp * pd.cartQuantity;
      if (pd.cartVariant?.mrp) sum += pd.cartVariant.mrp;
      return sum;
    }, 0);
  });

  /* ---------------------------------------------
   * ✅ BUY NOW PRODUCT SETUP (SAFE EFFECT)
   * --------------------------------------------- */
  private productDetailEffectChange = effect(() => {
    const pd = this.productDetail();
    const query = this.productDataFromQuery();

    if (!pd?.id) return;
    if (!this.isRedirectedFromBuyNow()) return;
    if (!this.isProductValid()) return;

    const product: Product = {
      name: pd.name,
      color: this.productDataFromQuery().color,
      mrp: pd.mrp,
      gender: pd.gender,
      productURL: pd._productURL,
      _isDisable: false,

      stockId: query.stockId,
      size: query.size,
      stockQuantity: query.qty,
      cartQuantity: query.qty ?? 1,
      cartId: 0,
      productId: pd.id,
      cartVariant: undefined,
    };

    this.checkoutData.set({
      totalAmount: pd.mrp,
      shippingAddresses: this.utilService.AddressData().map((v) => v as any),
      products: [product],
    });
  });

  private checkoutDataEffect = effect(() => {
    this.checkoutData();
    if (this.checkoutData().shippingAddresses.length) {
      this.selectedAddress.setValue(this.checkoutData().shippingAddresses[0].id);
    }
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private matdialog: MatDialog,
    private platformService: PlatformService,
  ) {
    super();

    const buyNow = activatedRoute.snapshot.queryParams['buy_now'];
    let data = activatedRoute.snapshot.queryParams['data'];

    try {
      if (data) {
        data = JSON.parse(data);
        this.productDataFromQuery.set(data);
      }
    } catch {}

    if (buyNow === 'true' && data) {
      if (this.productDataFromQuery().id) {
        this.getProductDetail(this.productDataFromQuery().id);
        // this.getVariantDetailBydId(this.productDataFromQuery().colorId)
      }
      this.isRedirectedFromBuyNow.set(true);
    } else {
      this.getCheckoutData();

      this.cartService.eventCartDataUpdated.subscribe(
        (val: { operation: CartUpdateOperation; index: number }) => {
          if (val.operation == CartUpdateOperation.delete) {
            this.checkoutData.update((data) => ({
              ...data,
              products: data.products.filter((_, index) => index != val.index),
            }));

            return;
          }

          this.checkoutData.update((data) => ({
            ...data,
            products: data.products.map((prod, index) => ({
              ...prod,
              cartQuantity:
                index == val.index
                  ? val.operation == CartUpdateOperation.increase
                    ? prod.cartQuantity + 1
                    : prod.cartQuantity - 1
                  : prod.cartQuantity,
            })),
          }));
        },
      );
    }
  }

  ngOnInit(): void {
    if (this.platformService.isBrowser) {
      window.scroll({ top: 0, behavior: 'smooth' });
    }
  }

  /* ---------------------------------------------
   * ✅ UI HELPERS
   * --------------------------------------------- */
  public getDataForCard(index: number): IProductCardSizeDT {
    const data = this.checkoutData().products[index];
    console.log(this.productDetail());
    
    console.log(data);
    const colorvarint = this.productDetail().colorVariants.find((cv) => cv.id == this.productDataFromQuery().colorId);


    let stockQty: number = colorvarint?.stocks.find((s) => s.id == data.stockId)?.quantity ?? 0;

    return {
      imageUrl: data.productURL,
      name: data.name,
      mrp: data.mrp,
      color: data.color,
      qty: data.cartQuantity,
      stock: { id: data.stockId, name: data.size },
      variant: data.cartVariant
        ? {
            id: data.cartVariant.variantId,
            name: data.cartVariant.name,
            mrp: data.cartVariant.mrp,
            stockQuantity: data.cartVariant.stockQuantity,
          }
        : undefined,
      // variant: null,
      stockQuantity: stockQty,
      isShowDelete: !this.isRedirectedFromBuyNow(),
    };
  }
  public upsertAddress(id: number = 0) {
    this.matdialog
      .open(AddressUpsertDialog, {
        width: '650px',
        maxWidth: '90vw',
        data: {
          id: id,
        },
      })
      .afterClosed()
      .subscribe((val: { saved: true }) => {
        if (val.saved) {
          this.updatedSelectedAddress(this.utilService.AddressData().length - 1);
        }
      });
  }
  public updatedSelectedAddress(index: number) {
    this.utilService.AddressData.update((addresses) => {
      if (!addresses || addresses.length === 0) return addresses;

      // If user clicked the first itself → no change
      if (index === 0) return addresses;

      // Create a copy (always a good practice)
      const updated = [...addresses];

      // Swap 0th element with clicked element
      [updated[0], updated[index]] = [updated[index], updated[0]];

      return updated;
    });
  }
  public alterCheckoutQuantity(operation: CartUpdateOperation, index: number) {
    if (this.isRedirectedFromBuyNow()) {
      this.checkoutData.update((state) => {
        const products = [...state.products];
        const qty = products[0].cartQuantity ?? 1;
        products[0] = {
          ...products[0],
          cartQuantity: operation === CartUpdateOperation.increase ? qty + 1 : qty - 1,
        };
        return { ...state, products };
      });
    } else {
      this.cartService.alterQuantityCnt(operation, index);
    }
  }

  public toggleViewAllAddress() {
    this.isViewAllAddress.update((v) => !v);
  }

  public onPaymentSubmit() {
    const payload: ICreateOrder = {
      // shippingAddressId: this.selectedAddress.value ?? 0,
      shippingAddressId: this.utilService.AddressData()[0]?.id ?? 0,
      shippingAddress: null,
      cartIds: [],
      products: [],
    };

    console.log(payload);
    // return

    if (!payload.shippingAddressId) {
      this.toastService.show({
        message: 'Select delivery address',
        type: EToastType.error,
        duration: 2000,
      });

      return;
    }

    this.isBtnLoader.update(() => true);

    if (this.isRedirectedFromBuyNow()) {
      this.checkoutData().products.forEach((value) => {
        const { stockId, cartVariant, cartQuantity } = value;

        const prod: IProductInfo = {
          stockId,
          variantId: cartVariant?.variantId ?? null,
          quantity: cartQuantity,
        };

        payload.products.push(prod);
      });
    } else {
      this.checkoutData().products.forEach((value) => {
        payload.cartIds.push(value.cartId);
      });

      this.checkoutData().products = [];
    }

    httpPost<IRGeneric<number>, ICreateOrder>(ApiRoutes.ORDERS.BASE, payload, true)
      .pipe(finalize(() => this.isBtnLoader.update(() => false)))
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.toastService.show({
              message: 'Order placed',
              type: EToastType.success,
              duration: 2000,
            });

            if (!this.isRedirectedFromBuyNow()) {
              this.cartService.getCartProduct();
            }

            this.router.navigate([appRoutes.ORDER]);
          } else {
            this.toastService.show({
              message: res.errorMessage,
              type: EToastType.error,
              duration: 2000,
            });
          }
        },
      });
  }

  public removeItemFromCart(cartId: number, index: number) {
    this.cartService.removeItemFromCart(cartId, index);
  }

  private getCheckoutData() {
    this.isShowloader.set(true);

    httpGet<IRGeneric<IResponseCheckout>>(ApiRoutes.CART.CHECKOUT)
      .pipe(finalize(() => this.isShowloader.set(false)))
      .subscribe({
        next: (res) => this.checkoutData.set(res?.data ?? initializeResponseCheckout()),
        error: () => this.checkoutData.set(initializeResponseCheckout()),
      });
  }

  private getVariantDetailBydId(colorVariantId: number){
    httpGet<IRGeneric<IRProductDetailRoot>>(ApiRoutes.PRODUCT.COLORVARIANT(colorVariantId), true).subscribe({
      next: (res: IRGeneric<IRProductDetailRoot>) => {
        if(res.data){
          console.log(res);
          
        }
      }
    })
  }
}
