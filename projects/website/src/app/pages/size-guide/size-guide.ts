import { Component, output, signal } from '@angular/core';
import { SIZE_CHART, SizeChart } from './size-guide.model';

@Component({
  selector: 'app-size-guide',
  imports: [],
  templateUrl: './size-guide.html',
  styleUrl: './size-guide.scss',
})
export class SizeGuide {
  public showSizeGuide = signal(true);
  public unloadSizeGuide = output<void>();
  public unit = signal<'cm' | 'in'>('in');
  public sizeChart: SizeChart[] = SIZE_CHART;


  public close() {
    this.showSizeGuide.update(() => false);
    this.unloadSizeGuide.emit();
  }

  public onBackdropClick(event: MouseEvent) {
    // Only close if clicking directly on backdrop (not bubbled from children)
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
