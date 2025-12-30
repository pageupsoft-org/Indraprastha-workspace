import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { GenderTypeEnum, IBanner, PlatformService } from '@shared';
import { IResponseCollection } from '../../../core/interface/response/collection.response';
import { Collection } from '../../../core/services/collection';
import { CommonModule } from '@angular/common';
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
  @Input() smallBanners: IBanner | null = null;

  public canScrollPrev: WritableSignal<boolean> = signal(false);
  public canScrollNext: WritableSignal<boolean> = signal(false);

  public womensWearList: WritableSignal<IResponseCollection[]> = signal([]);

  slideWidth = 0;
  slideMargin = 16; // matches your 16px margin

  constructor(private platformService: PlatformService, private collectionService: Collection) {
    this.collectionService.getCollection(GenderTypeEnum.Women, this.womensWearList);
  }

  // ngOnInit(): void {
  //  console.log('Women Wear Small Banners:', this.smallBanners);
  // }

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
        { passive: true }
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
    this.isMuted.update(() => this.videoPlayer?.nativeElement.muted ?? true);
  }
  
  public openProductPage(collectionId: number) {
    this.collectionService.openProductPage(collectionId, GenderTypeEnum.Women);
  }
}
