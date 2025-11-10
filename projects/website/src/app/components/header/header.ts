import {
  AfterViewInit,
  Component,
  computed,
  effect,
  Signal,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  WritableSignal,
  ElementRef,
} from '@angular/core';
import { GenderMenu } from './gender-menu/gender-menu';
import { RouterLink } from '@angular/router';
import { appRoutes } from '../../core/const/appRoutes.const';
import { CommonModule } from '@angular/common';
import { PlatformService } from '../../core/services/platform-service';
import { ShoppingCart } from '../shopping-cart/shopping-cart';
import { AuthManager } from "../auth-manager/auth-manager";

@Component({
  selector: 'app-header',
  imports: [GenderMenu, RouterLink, CommonModule, ShoppingCart, AuthManager],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @ViewChild('shoppingCartRef') shoppingCartRef!: ShoppingCart;
  @ViewChild('authFormRef') authFormRef!: AuthManager;
  public readonly appRoutes = appRoutes;

  public activeGender: WritableSignal<'men' | 'women' | ''> = signal('');
  private timeout: any;
  public isDropdownVisible: WritableSignal<boolean> = signal(false);

  public isCartOpen: WritableSignal<boolean> = signal(false);

  constructor() {}

  public openCart() {
    this.shoppingCartRef.openCart();
  }
  public openAuthForm() {
    this.authFormRef.openForm();
  }

  public setGender(type: 'men' | 'women' | ''): void {
    clearTimeout(this.timeout);
    this.isDropdownVisible.set(true);
    this.activeGender.set(type);
  }

  public clearGender(): void {
    this.isDropdownVisible.set(false);
    this.timeout = setTimeout(() => {
      this.activeGender.set('');
      this.isDropdownVisible.set(false);
    }, 400);
  }
}
