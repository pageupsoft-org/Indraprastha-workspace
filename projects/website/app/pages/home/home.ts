import { AfterViewInit, Component } from '@angular/core';
import { PlatformService } from '../../core/services/platform-service';
import AOS from 'aos';
import { ProductSlider } from "./product-slider/product-slider";
import { WomenWear } from "./women-wear/women-wear";
import { MensWear } from "./mens-wear/mens-wear";
// import taos from 'taos';

@Component({
  selector: 'app-home',
  imports: [ProductSlider, WomenWear, MensWear],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit {
  constructor(private platformService: PlatformService) {}

  ngAfterViewInit(): void {
    if (this.platformService.isBrowser) {
      AOS.init({
        once: true
      });
      // AOS.refresh();
    }
  }
}
