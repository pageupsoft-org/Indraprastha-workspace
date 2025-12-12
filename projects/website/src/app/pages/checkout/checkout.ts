import {
  Component,
  computed,
  effect,
  numberAttribute,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ICheckoutForm,
  initializeICheckoutForm,
  initializeResponseCheckout,
  IResponseCheckout,
  Product,
} from './checkout.model';
import { ApiRoutes, EToastType, httpGet, IRGeneric, PlatformService } from '@shared';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartService, CartUpdateOperation, ProductDetailBase } from '@website/core';
import {
  initializeIQueryToCheckout,
  IQueryToCheckout,
} from '../product-detail/product-detail.model';
import { AddressUpsertDialog } from '../../components/header/profile/address-upsert-dialog/address-upsert-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ProductCardSizeEdit } from '../../components/product-card-size-edit/product-card-size-edit';
import { IProductCardSizeDT } from '../../components/product-card-size-edit/product-card-size-edit.model';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CommonModule, ProductCardSizeEdit],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout extends ProductDetailBase implements OnInit {
  public CartUpdateOperation = CartUpdateOperation;
  public checkoutForm: FormGroup<ICheckoutForm> = initializeICheckoutForm();
  public checkoutData: WritableSignal<IResponseCheckout> = signal(initializeResponseCheckout());

  public isRedirectedFromBuyNow: WritableSignal<boolean> = signal(false);
  public isViewAllAddress: WritableSignal<boolean> = signal(false);
  public selectedAddress: FormControl<number | null> = new FormControl<number>(0);
  public productDataFromQuery: WritableSignal<IQueryToCheckout> = signal(
    initializeIQueryToCheckout()
  );

  public invalidProduct = effect(() => {
    this.isProductValid();
    if (!this.isProductValid()) {
      this.toastService.show({
        message: 'Invalid Product',
        type: EToastType.error,
        duration: 3000,
      });
    }
  });

  public total = computed(() => {
    return this.checkoutData().products.reduce((sum, pd) => {
      sum += pd.mrp;

      if (pd.cartVariant?.mrp) {
        sum += pd.cartVariant.mrp;
      }

      return sum;
    }, 0);
  });

  // this will only execute if user is redirected from buy now
  private productDetailEffectChange = effect(() => {
    this.productDetail();

    if (this.productDetail().id) {
      this.checkoutData.update(() => ({
        totalAmount: this.productDetail().mrp,
        shippingAddresses: this.utilService.AddressData().map((val) => val as any),
        products: [
          {
            name: this.productDetail().name,
            color: this.productDetail().color,
            mrp: this.productDetail().mrp,
            gender: this.productDetail().gender,
            productURL: this.productDetail().productURL,
            _isDisable: false,

            // Variant-related values from checkout item
            stockId: this.productDataFromQuery().stockId,
            size: this.productDataFromQuery().size,
            stockQuantity: this.productDataFromQuery().qty,
            cartQuantity: this.productDataFromQuery().qty ?? 0,
            cartId: 0,
            productId: this.productDetail().id,
            cartVariant: {
              name: '',
              mrp: 0,
              variantURL: '',
              stockId: 0,
              stockQuantity: 0,
              cartQuantity: 0,
              variantId: 0,
            },
          },
        ],
      }));

      this.isProductValid.update(() => true);

      this.isProductValid.update(() =>
        this.productDetail().stocks.some((v) => v.id == this.productDataFromQuery().stockId)
      );

      if (this.productDataFromQuery().variantStockId) {
        this.isProductValid.update(() =>
          this.productDetail().variants.some(
            (v) => v.stocks.id == this.productDataFromQuery().variantStockId
          )
        );

        const variant = this.productDetail().variants.find(
          (pv) => pv.stocks.id == this.productDataFromQuery().variantStockId
        );

        this.checkoutData.update((val) => ({
          ...val,
          products: val.products.map((pVal) => ({
            ...pVal,
            cartVariant: {
              name: variant?.name ?? '',
              mrp: variant?.mrp ?? 0,
              variantURL: '',
              stockId: this.productDataFromQuery().variantStockId,
              stockQuantity: variant?.stocks.quantity ?? 0,
              cartQuantity: 0,
              variantId: variant?.id ?? 0,
            },
          })),
        }));
      }
    }
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private matdialog: MatDialog,
    private platformService: PlatformService
  ) {
    super();
    let buyNow = activatedRoute.snapshot.queryParams['buy_now'];
    let data = activatedRoute.snapshot.queryParams['data'];
    try {
      if (data) {
        data = JSON.parse(data);
        this.productDataFromQuery.update(() => data);
      }
    } catch (err) {
      console.log(err);
    }

    if (buyNow && buyNow == 'true' && data) {
      if (this.productDataFromQuery().id && this.productDataFromQuery().stockId) {
        this.getProductDetail(this.productDataFromQuery().id);
      } else {
        this.isProductValid.update(() => false);
      }

      this.isRedirectedFromBuyNow.update(() => true);
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
        }
      );
    }
  }

  ngOnInit(): void {
    if (this.platformService.isBrowser) {
      window.scroll({ top: 0, behavior: 'smooth' });
    }
  }

  public removeItemFromCart(cartId: number, index: number){
    this.cartService.removeItemFromCart(cartId, index);
  }

  

  public getDataForCard(index: number): IProductCardSizeDT {
    const data: Product = this.checkoutData().products[index];

    return {
      imageUrl: data.productURL,
      name: data.name,
      mrp: data.mrp,
      color: data.color?.[0] ?? '',
      qty: data.cartQuantity,
      stock: {
        id: data.stockId,
        name: data.size,
      },

      variant: data.cartVariant
        ? {
            id: data.cartVariant.variantId,
            name: data.cartVariant.name,
            mrp: data.cartVariant.mrp,
          }
        : undefined,

      isShowDelete: !this.isRedirectedFromBuyNow()
    };
  }
  public alterQuantityCnt(operation: CartUpdateOperation, index: number) {
    if (this.isRedirectedFromBuyNow()) {
      this.checkoutData.update((state) => {
        const products = [...state.products];

        const currentQty = products[0].cartQuantity ?? 1;

        // increase or decrease
        const newQty =
          operation === CartUpdateOperation.increase ? currentQty + 1 : currentQty - 1; // never go below 1

        products[0] = {
          ...products[0],
          cartQuantity: newQty,
        };

        return { ...state, products };
      });
    } else {
      this.cartService.alterQuantityCnt(operation, index);
    }
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

  public toggleViewAllAddress() {
    this.isViewAllAddress.update((val) => !val);
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

  public onPaymentSumit() {
    console.log(this.checkoutData());

    // console.log(this.checkoutForm.value);
    if (this.checkoutForm.valid) {
      // proceed to payment
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }

  private getCheckoutData() {
    httpGet<IRGeneric<IResponseCheckout>>(ApiRoutes.CART.CHECKOUT).subscribe({
      next: (res) => {
        if (res?.data) {
          this.checkoutData.set(res.data);
        } else {
          this.checkoutData.set(initializeResponseCheckout());
        }
      },
      error: () => {
        this.checkoutData.set(initializeResponseCheckout());
      },
    });
  }
}
