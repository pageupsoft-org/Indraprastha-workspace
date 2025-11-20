import { AfterViewInit, Component, OnInit } from '@angular/core';
import AOS from 'aos';
import { ProductSlider } from "./product-slider/product-slider";
import { WomenWear } from "./women-wear/women-wear";
import { MensWear } from "./mens-wear/mens-wear";
import { ApiRoutes, DashboardProductTypeStringEnum, httpPost, initializePagInationPayload, IRGeneric, PlatformService } from '@shared';
import { Base } from '@portal/core';
import { IBanner, IBannerResponse } from '../../core/interface/response/banner.response';
import { EBannerConnectionType } from '../../../../../portal/src/app/core/enum/banner-connection-type.enum';
import { EbannerTypes } from '../../../../../portal/src/app/core/enum/banner-types.enum';
import { EGender } from '../../../../../portal/src/app/core/enum/gender.enum';
import { IBannerRequest } from './home.request';
// import taos from 'taos';

@Component({
  selector: 'app-home',
  imports: [ProductSlider, WomenWear, MensWear],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home extends Base implements AfterViewInit, OnInit {
  public readonly DashboardProductTypeStringEnum = DashboardProductTypeStringEnum;
  public topBanners: IBanner[] = [];
  public middleBanners: IBanner[] = [];

  constructor(private platformService: PlatformService) {
    super();
  }

  // On Init
  ngOnInit(): void {
   this.getTopBannerData();
   this.getMiddleBannerData();
  }

  // Initialize AOS animations
  ngAfterViewInit(): void {
    if (this.platformService.isBrowser) {
      AOS.init({
        once: true
      });
      // AOS.refresh();
    }
  }

  // Get Top Banner Data
  public getTopBannerData() {
    const payload: IBannerRequest = {
      ...initializePagInationPayload(),
      bannerType: EbannerTypes.Top,
      bannerConnectionType: EBannerConnectionType.Category,
      gender: EGender.Women,
    };
    httpPost<IRGeneric<IBannerResponse>, IBannerRequest>(ApiRoutes.BANNER.GET, payload).subscribe({
      next: (response) => {
        console.log(response.data.banners);
        this.topBanners = response.data.banners[0] ? response.data.banners : [];
      },
    });
  }

  // Get Middle Banner Data
  public getMiddleBannerData() {
    const payload: IBannerRequest = {
      ...initializePagInationPayload(),
      bannerType: EbannerTypes.Middle,
      bannerConnectionType: EBannerConnectionType.Category,
      gender: EGender.Men,
    };
    httpPost<IRGeneric<IBannerResponse>, IBannerRequest>(ApiRoutes.BANNER.GET, payload).subscribe({
      next: (response) => {
        console.log(response.data.banners);
        this.middleBanners = response.data.banners[0] ? response.data.banners : [];
      },
    });
  }
}
