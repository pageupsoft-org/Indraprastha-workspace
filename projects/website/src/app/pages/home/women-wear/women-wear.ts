import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { PlatformService } from '@shared';

@Component({
  selector: 'app-women-wear',
  imports: [],
  templateUrl: './women-wear.html',
  styleUrl: './women-wear.scss',
})
export class WomenWear implements AfterViewInit {
  @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('slide') slidesRef!: QueryList<ElementRef<HTMLDivElement>>;

  public womemsWearList: {
    image: string;
    name: string;
  }[] = [
    {
      image: 'assets/images/womens-wear-2.png',
      name: 'KAFTAN',
    },
    {
      image: 'assets/images/womens-wear-3.png',
      name: 'DRESSES',
    },
    {
      image: 'assets/images/womens-wear-4.png',
      name: 'SAREE',
    },
    {
      image: 'assets/images/womens-wear-2.png',
      name: 'LEHENGA',
    },
    {
      image: 'assets/images/womens-wear-3.png',
      name: 'KURTAS',
    },
    {
      image: 'assets/images/womens-wear-4.png',
      name: 'TOPS',
    },
    {
      image: 'assets/images/womens-wear-2.png',
      name: 'SKIRTS',
    },
    {
      image: 'assets/images/womens-wear-3.png',
      name: 'JEANS',
    },
  ];

  slideWidth = 0;
  slideMargin = 16; // matches your 16px margin

  constructor(private platformService: PlatformService) {}

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
}
