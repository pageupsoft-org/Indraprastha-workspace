import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { PlatformService } from '../../../core/services/platform-service';

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

  public mensWearList: {
    image: string;
    name: string;
  }[] = [
    {
      image: 'assets/images/mens-wear-1.png',
      name: 'Kurta Set',
    },
    {
      image: 'assets/images/mens-wear-2.png',
      name: 'Bandikoti',
    },
    {
      image: 'assets/images/mens-wear-3.png',
      name: 'Raja Koti',
    },
    {
      image: 'assets/images/mens-wear-4.png',
      name: 'Shirt',
    },
    {
      image: 'assets/images/mens-wear-5.png',
      name: 'Pocket Square',
    },
    {
      image: 'assets/images/mens-wear-1.png',
      name: 'Image 6',
    },
    {
      image: 'assets/images/mens-wear-2.png',
      name: 'Image 7',
    },
    {
      image: 'assets/images/mens-wear-3.png',
      name: 'Image 8',
    },
    {
      image: 'assets/images/mens-wear-4.png',
      name: 'Image 9',
    },
    {
      image: 'assets/images/mens-wear-5.png',
      name: 'Image 10',
    },
  ];

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
}
