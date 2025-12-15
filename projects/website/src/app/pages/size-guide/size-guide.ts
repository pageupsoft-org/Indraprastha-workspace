import { Component, signal } from '@angular/core';
import { SIZE_CHART, SizeChart } from './size-guide.model';

@Component({
  selector: 'app-size-guide',
  imports: [],
  templateUrl: './size-guide.html',
  styleUrl: './size-guide.scss',
})
export class SizeGuide {
  public unit = signal<'cm' | 'in'>('in');
  public sizeChart: SizeChart[] = SIZE_CHART;
}
