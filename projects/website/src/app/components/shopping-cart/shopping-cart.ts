import {
  Component,
  ElementRef,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { Loader } from '@shared';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  CartUpdateOperation,
  appRoutes,
  UtilityService,
  CartService,
} from '@website/core';
import { ProductCardSizeEdit } from '../product-card-size-edit/product-card-size-edit';
import { IProductCardSizeDT } from '../product-card-size-edit/product-card-size-edit.model';
import { IRCartRoot } from './shopping-cart.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-shopping-cart',
  imports: [Loader, CurrencyPipe, CommonModule, ProductCardSizeEdit],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCart {
  cart = viewChild<ElementRef>('shoppingCart');
  cartOverlay = viewChild<ElementRef>('cartOverlay');

  public showLoader: WritableSignal<boolean> = signal(false);
  public CartUpdateOperation = CartUpdateOperation;

  public readonly homeRoute = appRoutes.HOME;

  constructor(
    private utilService: UtilityService,
    public cartService: CartService,
    private router: Router,
    public matDialog: MatDialog
  ) {}

  public openCart() {
    this.cartOverlay()?.nativeElement.classList.remove('hidden');
    this.cart()?.nativeElement.classList.remove('translate-x-full');

    this.getData();
  }

  public hideCart() {
    this.cart()?.nativeElement.classList.add('translate-x-full');
    this.cartOverlay()?.nativeElement.classList.add('hidden');
    // this.cartService.cartData.set([]);
  }

  public alterQuantityCnt(operation: CartUpdateOperation, index: number) {
    this.cartService.alterQuantityCnt(operation, index);
  }

  private getData() {
    this.showLoader.set(true);
    this.cartService.getCartProduct().finally(() => {
      this.showLoader.set(false);
    });
  }
  public getDataForCard(index: number): IProductCardSizeDT {
    const data: IRCartRoot = this.cartService.cartData()[index];
    
    // Safety check to prevent runtime errors
    if (!data) {
      throw new Error(`Cart data at index ${index} is undefined`);
    }

    return {
      imageUrl: data.productURL || [],
      name: data.name || '',
      mrp: data.mrp || 0,
      color: data.color?.[0] ?? '',
      qty: data.cartQuantity || 0,
      stock: {
        id: data.stockId || 0,
        name: data.size || '',
      },

      variant: data.cartVariant && data.cartVariant.variantId
        ? {
            id: data.cartVariant.variantId,
            name: data.cartVariant.name || '',
            mrp: data.cartVariant.mrp || 0,
            stockQuantity: data.cartVariant.stockQuantity || 0,
          }
        : undefined,

      stockQuantity: data.stockQuantity || 0,
      isShowDelete: true,
    };
  }

  public routeToHome() {
    this.hideCart();
    this.router.navigate([appRoutes.HOME]);
  }
  public routeToCheckout() {
    this.hideCart();
    this.router.navigate([appRoutes.CHECKOUT]);
  }

  public removeItemFromCart(cartId: number, index: number) {
    this.cartService.removeItemFromCart(cartId, index);
  }

  public onBackdropClick(event: MouseEvent) {
    // Only close if clicking directly on backdrop (not bubbled from children)
    if (event.target === event.currentTarget) {
      this.hideCart();
    }
  }
}
