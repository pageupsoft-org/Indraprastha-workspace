import { Component, signal, WritableSignal } from '@angular/core';
import { ProductSlider } from '../home/product-slider/product-slider';
import { IRProductDetail } from '../../core/interface/response/product-detail.response';
import { DashboardProductTypeStringEnum } from '@shared';

@Component({
  selector: 'app-product-detail',
  imports: [ProductSlider],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  public productDetail: WritableSignal<IRProductDetail> = signal({
    image: [
      'assets/images/mens-wear-1.png',
      'assets/images/mens-wear-2.png',
      'assets/images/mens-wear-3.png',
      'assets/images/mens-wear-4.png',
    ],
    activeImage: "assets/images/mens-wear-1.png"
  });

  public DashboardProductTypeStringEnum = DashboardProductTypeStringEnum

  constructor() {
  }

  public enlargeImage(img: string){
    this.productDetail().activeImage = img
  }
}
