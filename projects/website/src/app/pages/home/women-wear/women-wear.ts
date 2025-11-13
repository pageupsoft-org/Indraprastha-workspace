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
import {
  ApiRoutes,
  DashboardProductTypeStringEnum,
  httpPost,
  initializePagInationPayload,
  IRGeneric,
  PlatformService,
} from '@shared';
import { IDashboadRequest } from '../product-slider/dashboard.request';
import { DashboardResponseRoot, Product } from '../product-slider/dashboard.response';
import { sign } from 'crypto';

@Component({
  selector: 'app-women-wear',
  imports: [],
  templateUrl: './women-wear.html',
  styleUrl: './women-wear.scss',
})
export class WomenWear implements AfterViewInit {
  @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('slide') slidesRef!: QueryList<ElementRef<HTMLDivElement>>;

  private payload: IDashboadRequest = {
    ...initializePagInationPayload(),
    type: DashboardProductTypeStringEnum.Women,
  };

  public womemsWearList: WritableSignal<Product[]> = signal([]);

  slideWidth = 0;
  slideMargin = 16; // matches your 16px margin

  constructor(private platformService: PlatformService) {
    this.getDashboardProduct();
  }

  ngAfterViewInit(): void {
    if (this.platformService.isBrowser) {
      const slides = this.slidesRef.toArray();
      if (slides.length > 0) {
        this.slideWidth = slides[0].nativeElement.offsetWidth;
      }
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
  }

  private getDashboardProduct() {
    httpPost<IRGeneric<DashboardResponseRoot>, IDashboadRequest>(
      ApiRoutes.PRODUCT.DASHBOARD,
      this.payload,
      false
    ).subscribe({
      next: (response) => {
        if (response?.data) {
          this.womemsWearList.set(response.data.products);
        }
      },
      error: (error) => {
        console.error('Dashboard Product Error: ', error);
      },
    });
  }
}
