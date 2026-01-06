import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import AOS from 'aos';
import { ProductSlider } from './product-slider/product-slider';
import { WomenWear } from './women-wear/women-wear';
import { MensWear } from './mens-wear/mens-wear';
import {
  DashboardProductTypeStringEnum,
  initializePagInationPayload,
  PlatformService,
} from '@shared';
import { Base } from '@portal/core';
import { Product } from './product-slider/dashboard.response';
import { IDashboadRequest } from './product-slider/dashboard.request';
import { Collection } from '../../core/services/collection';
import { ApiCallService, appRoutes } from '@website/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ProductSlider, WomenWear, MensWear],
  providers: [Collection],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home extends Base implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  public readonly DashboardProductTypeStringEnum = DashboardProductTypeStringEnum;
  public topBanners: string | null = null;
  public middleBanners: string | null = null;
  public productList = signal<Product[]>([]);
  public isMuted = signal(true);
  private isComponentActive = true;

  private payload: IDashboadRequest = {
    ...initializePagInationPayload(),
    isPaginate: false,
    type: DashboardProductTypeStringEnum.NewArrival,
  };

  // public bannerList: WritableSignal<IBanner[]> = signal([]);

  constructor(
    private platformService: PlatformService,
    public apiCallService: ApiCallService,
    public router: Router
  ) {
    super();
  }

  // On Init
  ngOnInit(): void {
    this.isComponentActive = true;

    if (this.platformService.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.getDashboardProduct();
  }

  override ngOnDestroy(): void {
    this.isComponentActive = false;
  }

  private ensureVideoPlays(): void {
    if (this.platformService.isBrowser && this.videoPlayer?.nativeElement && this.isComponentActive) {
      const video = this.videoPlayer.nativeElement;
      
      // Simple approach: just play the video
      video.currentTime = 0;
      video.muted = this.isMuted();
      
      video.play().catch((e) => {
        console.log('Autoplay prevented:', e);
      });
    }
  }

  public toggleMute() {
    if (this.videoPlayer?.nativeElement) {
      this.isMuted.update(() => !this.videoPlayer.nativeElement.muted);
      this.videoPlayer.nativeElement.muted = this.isMuted();
    }
  }

  public onVideoLoaded() {
    // Called when video data is loaded, ensure it plays
    setTimeout(() => {
      this.ensureVideoPlays();
    }, 100);
  }

  // Initialize AOS animations
  ngAfterViewInit(): void {
    if (this.platformService.isBrowser) {
      AOS.init({
        once: true,
      });
    }

    // Simple delay to ensure video plays
    setTimeout(() => {
      this.ensureVideoPlays();
    }, 300);
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
        console.error('Dashboard Product Error: ', error);
      },
    });
  }

  onBannerError(type: 'top' | 'middle') {
    if (type === 'top') {
      this.topBanners = 'assets/images/banner-image2.png';
    } else {
      this.middleBanners = 'assets/images/banner-image2.png';
    }
  }

  public routeToCollection(){
    this.router.navigate([appRoutes.COLLECTION]);
  }
}
