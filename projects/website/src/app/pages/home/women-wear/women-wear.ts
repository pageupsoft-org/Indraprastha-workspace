import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { GenderTypeEnum, initializePagInationPayload, PlatformService } from '@shared';
import { IResponseCollection } from '../../../core/interface/response/collection.response';
import { Collection } from '../../../core/services/collection';
import { CommonModule } from '@angular/common';
import { ApiCallService } from '@website/core';
import {
  IProduct,
  IProductPagination,
} from '../../../../../../portal/src/app/pages/product/product.model';
@Component({
  selector: 'app-women-wear',
  imports: [CommonModule],
  templateUrl: './women-wear.html',
  styleUrl: './women-wear.scss',
})
export class WomenWear implements AfterViewInit {
  @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('slide') slidesRef!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  public isMuted = signal(true);

  public canScrollPrev: WritableSignal<boolean> = signal(false);
  public canScrollNext: WritableSignal<boolean> = signal(false);
  public showVideoLoader: WritableSignal<boolean> = signal(true);

  // public womensWearList: WritableSignal<IResponseCollection[]> = signal([]);
  public womensWearList: WritableSignal<IProduct[]> = signal([]);

  slideWidth = 0;
  slideMargin = 16; // matches your 16px margin

  constructor(
    private platformService: PlatformService,
    private collectionService: Collection,
    public apiCallService: ApiCallService,
  ) {
    // this.collectionService.getCollection(GenderTypeEnum.Women, this.womensWearList);
    this.getWomensProduct();
  }

  ngAfterViewInit(): void {
    if (this.platformService.isBrowser) {
      const slides = this.slidesRef.toArray();
      if (slides.length > 0) {
        this.slideWidth = slides[0].nativeElement.offsetWidth;
        this.updateButtonStates();
      }
    }
    if (this.platformService.isBrowser && this.videoPlayer) {
      this.videoPlayer.nativeElement.play().catch((e) => console.log('Autoplay prevented:', e));
    }

    if (this.platformService.isBrowser && this.sliderRef) {
      this.sliderRef.nativeElement.addEventListener(
        'scroll',
        () => {
          this.updateButtonStates();
        },
        { passive: true },
      );
    }
  }

  public scrollSlider(direction: 'next' | 'prev'): void {
    if (!this.platformService.isBrowser) return;

    const slider = this.sliderRef.nativeElement;
    const scrollAmount = this.slideWidth + this.slideMargin;
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

    if (direction === 'next') {
      // Only scroll if not at or beyond max scroll left
      if (slider.scrollLeft < maxScrollLeft) {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
      // Else do nothing to prevent jump to start
    } else {
      // Only scroll if not at or before 0
      if (slider.scrollLeft > 0) {
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
      // Else do nothing to prevent jump to end
    }

    // Wait for scroll to complete before updating signals
    setTimeout(() => this.updateButtonStates(), 150);
  }

  private updateButtonStates(): void {
    if (!this.platformService.isBrowser || !this.sliderRef) return;

    const slider = this.sliderRef.nativeElement;
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

    this.canScrollPrev.update(() => slider.scrollLeft > 0);
    this.canScrollNext.update(() => slider.scrollLeft < maxScrollLeft);
  }

  public toggleMute() {
    if (this.videoPlayer?.nativeElement) {
      this.isMuted.update(() => !this.videoPlayer.nativeElement.muted);
      this.videoPlayer.nativeElement.muted = this.isMuted();
    }
  }

  onVideoLoaded() {
    this.showVideoLoader.set(false);
    setTimeout(() => {
      this.ensureVideoPlays();
    }, 100);
  }
  private ensureVideoPlays(): void {
    if (this.platformService.isBrowser && this.videoPlayer?.nativeElement) {
      const video = this.videoPlayer.nativeElement;

      // Simple approach: just play the video
      video.currentTime = 0;
      video.muted = this.isMuted();

      video.play().catch((e) => {
        console.log('Autoplay prevented:', e);
      });
    }
  }
  public openProductPage(collectionId: number) {
    this.collectionService.openProductPage(collectionId, GenderTypeEnum.Women);
  }

  private getWomensProduct() {
    const payLoad: IProductPagination = {
      ...initializePagInationPayload(),
      collectionId: null,
      categoryId: null,
      gender: GenderTypeEnum.Women,
    };
    this.collectionService.getAllProduct(payLoad).then((res: IProduct[]) => {
      this.womensWearList.set(res);
    });
  }
}
