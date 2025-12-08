import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDigitOnly]'
})
export class DigitOnlyDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow special keys like backspace, arrow keys, delete, tab
    if (
      [46, 8, 9, 27, 13, 110, 190].indexOf(event.keyCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) ||
      (event.keyCode === 67 && (event.ctrlKey || event.metaKey)) ||
      (event.keyCode === 86 && (event.ctrlKey || event.metaKey)) ||
      (event.keyCode === 88 && (event.ctrlKey || event.metaKey)) ||
      // Allow home, end, left, right arrow keys
      (event.keyCode >= 35 && event.keyCode <= 39)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9.]/g, ''); // Allows decimal points
  }
}