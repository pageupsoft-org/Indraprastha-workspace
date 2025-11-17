import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  imports: [],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss',
})
export class ShoppingCart {
  @ViewChild('shoppingCart') cart!: ElementRef;
  @ViewChild('cartOverlay') cartOverlay!: ElementRef;

  public openCart() {
    this.cartOverlay.nativeElement.classList.remove('hidden');
    this.cart.nativeElement.classList.remove('translate-x-full');
  }

  public hideCart() {
    this.cart.nativeElement.classList.add('translate-x-full');
    this.cartOverlay.nativeElement.classList.add('hidden');
  }
}
