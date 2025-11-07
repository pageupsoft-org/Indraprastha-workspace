import { Component, signal, WritableSignal } from '@angular/core';
import { IRWishlist } from '../../core/interface/response/wishlist.response';
import { RouterLink } from '@angular/router';
import { appRoutes } from '../../core/const/appRoutes.const';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist {
  public readonly productDetailRoute: string = appRoutes.PRODUCTDETAIL;

  public wishlistArray: WritableSignal<IRWishlist[]> = signal([
    {
      id: 1,
      images: ['assets/images/wishlist-1.png', 'assets/images/wishlist-2.png'],
      name: 'Luxe Matka Silk Anarkali',
      price: 78465.9,
      icon: 'assets/icons/delete-black.svg',
    },
    {
      id: 2,
      images: ['assets/images/wishlist-2.png', 'assets/images/wishlist-3.png'],
      name: 'Elegant Cotton Saree',
      price: 12345.0,
      icon: 'assets/icons/delete-black.svg',
    },
    {
      id: 3,
      images: ['assets/images/wishlist-3.png', 'assets/images/wishlist-1.png'],
      name: 'Chic Designer Lehenga',
      price: 54321.5,
      icon: 'assets/icons/delete-black.svg',
    },
    {
      id: 4,
      images: ['assets/images/wishlist-4.png', 'assets/images/wishlist-5.png'],
      name: 'Classic Georgette Dress',
      price: 26789.99,
      icon: 'assets/icons/delete-black.svg',
    },
    {
      id: 5,
      images: ['assets/images/wishlist-2.png', 'assets/images/wishlist-5.png'],
      name: 'Stylish Silk Kurti',
      price: 19876.75,
      icon: 'assets/icons/delete-black.svg',
    },
  ]);

  public addRedColorDeleteIcon(isEnter: boolean, index: number) {
    this.wishlistArray()[index].icon = isEnter
      ? 'assets/icons/delete-red.svg'
      : 'assets/icons/delete-black.svg';
  }

  public routeToProductDetail() {}
}
