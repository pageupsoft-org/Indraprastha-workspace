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
  createUrlFromObject,
  DashboardProductTypeStringEnum,
  GenderTypeEnum,
  httpGet,
  initializePagInationPayload,
  IRGeneric,
  PlatformService,
} from '@shared';
import { IDashboadRequest } from '../product-slider/dashboard.request';
import { Router } from '@angular/router';
import { IResponseCollection } from '../../../core/interface/response/collection.response';
import { Collection } from '../../../core/services/collection';
@Component({
  selector: 'app-women-wear',
  imports: [],
  templateUrl: './women-wear.html',
  styleUrl: './women-wear.scss',
})
export class WomenWear implements AfterViewInit {
  @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('slide') slidesRef!: QueryList<ElementRef<HTMLDivElement>>;

  public womemsWearList: WritableSignal<IResponseCollection[]> = signal([]);

  slideWidth = 0;
  slideMargin = 16; // matches your 16px margin

  constructor(private platformService: PlatformService, private collectionService: Collection) {
    this.collectionService.getCollection(GenderTypeEnum.Women, this.womemsWearList);
  }

  ngAfterViewInit(): void {
    if (this.platformService.isBrowser) {
      const slides = this.slidesRef.toArray();
      if (slides.length > 0) {
        this.slideWidth = slides[0].nativeElement.offsetWidth;
      }
    }
  }

  public openProductPage(collectionId: number) {
    this.collectionService.openProductPage(collectionId);
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
}
