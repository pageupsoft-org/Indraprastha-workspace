import { AfterViewInit, Component, OnInit } from '@angular/core';
import AOS from 'aos';
import { ProductSlider } from "./product-slider/product-slider";
import { WomenWear } from "./women-wear/women-wear";
import { MensWear } from "./mens-wear/mens-wear";
import { ApiRoutes, DashboardProductTypeStringEnum, EBannerConnectionType, EbannerTypes, GenderTypeEnum, httpPost, IBanner, IBannerPagination, IBannerResponse, initializePagInationPayload, IRGeneric, PlatformService } from '@shared';
import { Base } from '@portal/core';

@Component({
  selector: 'app-home',
  imports: [ProductSlider, WomenWear, MensWear],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class Home extends Base implements AfterViewInit, OnInit {
  public readonly DashboardProductTypeStringEnum = DashboardProductTypeStringEnum;
  public topBanners: string | null = null;
  public middleBanners: string | null = null;

  constructor(private platformService: PlatformService) {
    super();
  }

  // On Init
  ngOnInit(): void {
    this.callAllBannerApis();

    if(this.platformService.isBrowser){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  public callAllBannerApis() {
    const topPayload = this.buildBannerPayload(EbannerTypes.Top, EBannerConnectionType.Category, GenderTypeEnum.Women);
    const middlePayload = this.buildBannerPayload(EbannerTypes.Middle, EBannerConnectionType.Category, GenderTypeEnum.Men);

    this.getBannerData(topPayload, 'top');
    this.getBannerData(middlePayload, 'middle');
  }

  public buildBannerPayload(
    bannerType: EbannerTypes,
    bannerConnectionType: EBannerConnectionType,
    gender: GenderTypeEnum,
  ): IBannerPagination {
    return {
      ...initializePagInationPayload(),
      bannerType: bannerType,
      bannerConnectionType: bannerConnectionType,
      gender: gender,
    }
  }

  public getBannerData(payload: IBannerPagination, type: 'top' | 'middle') {
    httpPost<IRGeneric<IBannerResponse>, IBannerPagination>(ApiRoutes.BANNER.GET, payload)
      .subscribe({
        next: (response) => {
          if (response) {
            if (response.data) {
              const banners = response.data.banners?.length ? response.data.banners[0].bannerURL : '';
              if (type === 'top') {
                this.topBanners = banners
              } else {
                this.middleBanners = banners;
              }
            }
          }
        }
      });
  }

  onBannerError(type: 'top' | 'middle') {
    if (type === 'top') {
      this.topBanners = 'assets/images/banner-image2.png';
    } else {
      this.middleBanners = 'assets/images/banner-image2.png';
    }
  }

}
