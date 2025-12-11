import { Directive, HostListener,  Optional} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[contactValidators]'
})
export class ContactValidators{
  constructor(
    @Optional() private ngControl: NgControl
  ) {
    console.log(this.ngControl)
  }


@HostListener('input', ['$event'])
  onInput(event: Event) {
   const input = event.target as HTMLInputElement;
    const raw = input.value;          
    const value = raw.replace(/[^0-9]/g, '');  
    if (value === '') {
      this.ngControl?.control?.setValue(null);
      return;
    }
     this.ngControl?.control?.setValue(value);
  }
}
