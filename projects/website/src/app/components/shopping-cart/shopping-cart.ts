import {
  Component,
  computed,
  ElementRef,
  Signal,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ApiRoutes, httpGet, IRGeneric, Loader } from '@shared';
import { IRCartRoot } from './shopping-cart.model';
import { CartUpdateOperation } from '../../core/enum/cart.enum';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  imports: [Loader, CurrencyPipe],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCart {
  @ViewChild('shoppingCart') cart!: ElementRef;
  @ViewChild('cartOverlay') cartOverlay!: ElementRef;

  public showLoader: WritableSignal<boolean> = signal(false);
  public cartData: WritableSignal<IRCartRoot[]> = signal([]);

  public CartUpdateOperation = CartUpdateOperation;
  public cartTotalMrp: Signal<number> = computed(() => {
    return this.cartData().reduce((total, item) => total + item.mrp * item.cartQuantity, 0);
  });

  public openCart() {
    this.cartOverlay.nativeElement.classList.remove('hidden');
    this.cart.nativeElement.classList.remove('translate-x-full');

    this.getData();
  }

  public hideCart() {
    this.cart.nativeElement.classList.add('translate-x-full');
    this.cartOverlay.nativeElement.classList.add('hidden');
    this.cartData.set([]);
  }

  public alterQuantityCnt(operation: CartUpdateOperation, index: number) {
    this.cartData.update((cart) => {
      const updated = [...cart]; // create new array reference
      const item = { ...updated[index] }; // copy item

      if (operation === CartUpdateOperation.increase) {
        item.cartQuantity += 1;
      } else {
        if (item.cartQuantity > 1) {
          item.cartQuantity -= 1;
        }
      }

      updated[index] = item; // replace updated item
      return updated;
    });
  }

  private getData() {
    this.showLoader.set(true);
    httpGet<IRGeneric<IRCartRoot[]>>(ApiRoutes.CART.GET).subscribe({
      next: (res) => {
        if (res?.data) {
          this.cartData.set(res.data);
        } else {
          this.cartData.set([]);
        }
        this.showLoader.set(false);
      },

      error: (err) => {
        this.showLoader.set(false);
      },
    });
  }
}
