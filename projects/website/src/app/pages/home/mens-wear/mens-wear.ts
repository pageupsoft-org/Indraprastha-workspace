import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  signal,
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

@Component({
  selector: 'app-mens-wear',
  imports: [],
  templateUrl: './mens-wear.html',
  styleUrl: './mens-wear.scss',
})
export class MensWear implements AfterViewInit {
  @ViewChildren('itemRef') items!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('galleryRef') gallery!: QueryList<ElementRef<HTMLDivElement>>;
  private currentIndex = 2;
  private readonly visibleCount = 5;

  public mensWearList: WritableSignal<Product[]> = signal([]);

  private payload: IDashboadRequest = {
    ...initializePagInationPayload(),
    type: DashboardProductTypeStringEnum.Women,
  };

  constructor(private platformService: PlatformService) {}

  ngAfterViewInit(): void {
    if (this.platformService.isBrowser) {
      this.updateGallery();
    }
  }

  private updateGallery(): void {
    const gallery = this.gallery.first?.nativeElement;
    if (!gallery) return;

    const offset = -this.currentIndex * (100 / this.visibleCount);
    gallery.style.transform = `translateX(${offset}%)`;

    this.items.forEach((item, index) => {
      item.nativeElement.classList.toggle(
        'active',
        index === (this.currentIndex + 2) % this.mensWearList.length
      );
    });
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateGallery();
    }
  }

  next(): void {
    if (this.currentIndex < this.mensWearList.length - this.visibleCount) {
      this.currentIndex++;
      this.updateGallery();
    }
  }

  zoomImage(item: HTMLDivElement, index: number): void {
    this.items.forEach((i) => i.nativeElement.classList.remove('active'));
    item.classList.add('active');
    this.currentIndex = index - 2;

    if (this.currentIndex < 0) this.currentIndex = 0;
    if (this.currentIndex > this.mensWearList.length - this.visibleCount)
      this.currentIndex = this.mensWearList.length - this.visibleCount;

    this.updateGallery();
  }

  private getDashboardProduct() {
    httpPost<IRGeneric<DashboardResponseRoot>, IDashboadRequest>(
      ApiRoutes.PRODUCT.DASHBOARD,
      this.payload,
      false
    ).subscribe({
      next: (response) => {
        if (response?.data) {
          this.mensWearList.set(response.data.products);
        }
      },
      error: (error) => {
        console.error('Dashboard Product Error: ', error);
      },
    });
  }
}
