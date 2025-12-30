import { AfterViewInit, Component, ElementRef, Input, OnInit, signal, ViewChild } from '@angular/core';
import AOS from 'aos';
import { ProductSlider } from './product-slider/product-slider';
import { WomenWear } from './women-wear/women-wear';
import { MensWear } from './mens-wear/mens-wear';
import {
  ApiRoutes,
  CustomToken,
  DashboardProductTypeStringEnum,
  EBannerConnectionType,
  EbannerTypes,
  GenderTypeEnum,
  httpPost,
  IBanner,
  IBannerPagination,
  IBannerResponse,
  initializePagInationPayload,
  IRGeneric,
  PlatformService,
} from '@shared';
import { Base } from '@portal/core';
import { DashboardResponseRoot, Product } from './product-slider/dashboard.response';
import { IDashboadRequest } from './product-slider/dashboard.request';
import { Collection } from '../../core/services/collection';
import { ApiCallService } from '@website/core';

@Component({
  selector: 'app-home',
  imports: [ProductSlider, WomenWear, MensWear],
  providers: [Collection],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home extends Base implements AfterViewInit, OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  public readonly DashboardProductTypeStringEnum = DashboardProductTypeStringEnum;
  public productList = signal<Product[]>([]);
  public isMuted = signal(true);
  public topMostBanners: IBanner | null = null;
  public middleBanners: IBanner | null = null;
  public smallBanners: IBanner | null = null;
  public bottomBanners: IBanner | null = null;
  public bannerData: IBanner | null = null;

  private payload: IDashboadRequest = {
    ...initializePagInationPayload(),
    type: DashboardProductTypeStringEnum.NewArrival,
  };

  constructor(private platformService: PlatformService, private apiCallService: ApiCallService) {
    super();
  }

  // On Init
  ngOnInit(): void {
    this.callAllBannerApis();

    if (this.platformService.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.getDashboardProduct();
    // this.callAllBannerApis()
  }

  public toggleMute() {
    if (this.videoPlayer?.nativeElement) {
      this.isMuted.update(() => !this.videoPlayer.nativeElement.muted);
      this.videoPlayer.nativeElement.muted = this.isMuted();
    }
  }

  // Initialize AOS animations
  ngAfterViewInit(): void {
    if (this.platformService.isBrowser) {
      AOS.init({
        once: true,
      });
    }

    if (this.platformService.isBrowser && this.videoPlayer) {
      this.videoPlayer.nativeElement.play().catch(() => { });
    }
  }

  public callAllBannerApis() {
    const topPayload = this.buildBannerPayload(
      EbannerTypes.Top,
      EBannerConnectionType.None,
      GenderTypeEnum.Women
    );
    const middlePayload = this.buildBannerPayload(
      EbannerTypes.Middle,
      EBannerConnectionType.None,
      GenderTypeEnum.Men
    );
    const smallPayload = this.buildBannerPayload(
      EbannerTypes.Small,
      EBannerConnectionType.None,
      GenderTypeEnum.Women
    );
    const bottomPayload = this.buildBannerPayload(
      EbannerTypes.Bottom,
      EBannerConnectionType.None,
      GenderTypeEnum.Men
    );

    this.getBannerData(topPayload, 'Top');
    this.getBannerData(middlePayload, 'Middle');
    this.getBannerData(smallPayload, 'Small');
    this.getBannerData(bottomPayload, 'Bottom');
  }

  public buildBannerPayload(
    bannerType: EbannerTypes,
    bannerConnectionType: EBannerConnectionType,
    gender: GenderTypeEnum
  ): IBannerPagination {
    return {
      ...initializePagInationPayload(),
      bannerType: bannerType,
      bannerConnectionType: bannerConnectionType,
      gender: gender,
    };
  }

  public getBannerData(payload: IBannerPagination, type: 'Top' | 'Middle' | 'Bottom' | 'Small') {
    this.apiCallService.getBannerData(payload, type).subscribe({
      next: (response) => {
        if (response) {
          if (response.data) {
            // console.log('Banner Response:', response);
            switch (type) {
              case 'Top':
                this.topMostBanners = response.data.banners[0];
                break;

              case 'Middle':
                this.middleBanners = response.data.banners[0];
                break;

              case 'Small':
                this.smallBanners = response.data.banners[0];
                break;

              case 'Bottom':
                this.bottomBanners = response.data.banners[0];
                break;
            }
          }
          console.log(`${type} Banner Data:`, response.data);
        }
      }
    },
    );
  }

  private getDashboardProduct() {
    this.apiCallService.getDashboardProduct(this.payload).subscribe({
      next: (response) => {
        if (response?.data?.products) {
          this.productList.set(response.data.products);
        } else {
          this.productList.set([]);
        }
      },
      error: (error) => {
        //console.error('Dashboard Product Error:', error);
      },
    });
  }

  public onBannerError(type: 'top' | 'middle') {
    // if (type === 'top') {
    //   this.topBanners = 'assets/images/banner-image2.png';
    // } else {
    //   this.middleBanners = 'assets/images/banner-image2.png';
    // }
  }

}
