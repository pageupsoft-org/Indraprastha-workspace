import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs';
import { PlatformService, setHttpClient, Toast } from '@shared';
import { CartService } from '../../../website/src/app/core/services/cart-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App  {
  public currentRoute: string = '';
  protected readonly title = signal('Indraprastha-portal');
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private cartService: CartService,
    private platformService: PlatformService
  ) {
    setHttpClient(httpClient);

    // cartService.getCartProduct().then(() => {
    //   console.log('app');
    // });
    // calling to get cart count
    // if (platformService.isBrowser) {
    // }
  }

 
}
