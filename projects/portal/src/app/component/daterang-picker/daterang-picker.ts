import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;
import moment from 'moment';

interface EmitDate {
  startDate: string,
  endDate: string
}

@Component({
  selector: 'app-daterang-picker',
  imports: [],
  templateUrl: './daterang-picker.html',
  styleUrl: './daterang-picker.scss',
})

export class DaterangPicker implements AfterViewInit, OnChanges {

  @Output() emitDateObject: EventEmitter<EmitDate> = new EventEmitter<EmitDate>();

  private dateObj: EmitDate = {
    startDate: '',
    endDate: ''
  };
  private isDatePickerInitialized = false;

  constructor(private cdRef: ChangeDetectorRef, private route: Router, private router: ActivatedRoute) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isDatePickerInitialized && (changes['startDate'] || changes['endDate'])) {
      const start = moment().subtract(7, 'days');
      const end = moment();

      $('#daterange').data('daterangepicker').setStartDate(start);
      $('#daterange').data('daterangepicker').setEndDate(end);

      $('#daterange').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
    }
  }

  // used because date range picker needs DOM ready.
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initDatePicker();
    });
  }

  private initDatePicker(): void {
    const today = moment();
    const oneWeekAgo = moment().subtract(7, 'days');

    const start = oneWeekAgo;
    const end = today;


    $('#daterange').daterangepicker({
      opens: 'left',
      showDropdowns: true,
      autoUpdateInput: true,
      startDate: start,
      endDate: end,
      maxDate: today,
    });

    $('#daterange').on('apply.daterangepicker', (ev: any, picker: any) => {
      const startDate = picker.startDate.format('YYYY-MM-DD');
      const endDate = picker.endDate.format('YYYY-MM-DD');

      this.dateObj.startDate = startDate;
      this.dateObj.endDate = endDate;

      this.emitDateObject.emit(this.dateObj);
    });
    $('#daterange').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));

    this.isDatePickerInitialized = true;
    this.cdRef.detectChanges();
  }

  public onChange(event: any) {
    const [startRaw, endRaw] = (event.target.value as string).split('-');
    this.dateObj.startDate = this.convertToYYYYMMDD(startRaw);
    this.dateObj.endDate = this.convertToYYYYMMDD(endRaw);
    this.emitDateObject.emit(this.dateObj);
  }

  // public onChange(){
  //    console.log("input change")
  // }

  private convertToYYYYMMDD(date: string): string {
    const daateArr: string[] = date.split('/');
    return `${daateArr[2].trim()}-${daateArr[0].trim()}-${daateArr[1].trim()}`;
  }


}
