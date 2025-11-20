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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mens-wear',
  imports: [CommonModule],
  templateUrl: './mens-wear.html',
  styleUrl: './mens-wear.scss',
})
export class MensWear implements AfterViewInit {
  @ViewChild('galleryRef') gallery!: ElementRef<HTMLDivElement>;
  @ViewChildren('itemRef') items!: QueryList<ElementRef<HTMLDivElement>>;

  public currentIndex = 2;
  private readonly visibleCount = 5;

  public mensWearList: WritableSignal<Product[]> = signal([]);

  private payload: IDashboadRequest = {
    ...initializePagInationPayload(),
    type: DashboardProductTypeStringEnum.Men,
  };

  constructor(private platformService: PlatformService) {
    this.getDashboardProduct();
  }

  ngAfterViewInit(): void {
    // Whenever @for renders or updates, this will fire
    this.items.changes.subscribe(() => {
      // console.log('Items loaded:', this.items.length);
      this.updateGallery();
    });

    // Call once in case items are already available
    setTimeout(() => this.updateGallery());
  }

  private updateGallery(): void {
    const galleryEl = this.gallery?.nativeElement;
    if (!galleryEl) return;

    const centerIndex = Math.floor(this.visibleCount / 2);
    const offsetIndex = this.currentIndex - centerIndex;
    const offset = -(offsetIndex * (100 / this.visibleCount));

    galleryEl.style.transform = `translateX(${offset}%)`;

    this.items.forEach((item, index) => {
      item.nativeElement.classList.toggle('active', index === this.currentIndex);
    });
  }

  prev(): void {
    const minCenterIndex = Math.floor(this.visibleCount / 2); // 2
    if (this.currentIndex > minCenterIndex) {
      this.currentIndex--;
      this.updateGallery();
    }
  }

  next(): void {
    const center = Math.floor(this.visibleCount / 2); // 2
    const maxCenterIndex = this.mensWearList().length - center - 1; // length - 3

    if (this.currentIndex < maxCenterIndex) {
      this.currentIndex++;
      this.updateGallery();
    }
  }
  
  public zoomImage(item: HTMLDivElement, index: number): void {
    if (index < 2) return; // cannot zoom first two images
    if (!(index + 2 <= this.mensWearList().length - 1)) return; // cannot zoom last two images

    // remove previous active
    this.items.forEach((i) => i.nativeElement.classList.remove('active'));

    // set active on clicked
    item.classList.add('active');

    // update center index
    this.currentIndex = index;

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
