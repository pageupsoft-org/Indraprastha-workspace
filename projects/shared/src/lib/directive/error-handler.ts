// import { Directive, ElementRef, Input, Renderer2, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, DoCheck, Optional, Self } from '@angular/core';
// import { AbstractControl, NgControl } from '@angular/forms';
// import { Subscription } from 'rxjs';

// @Directive({
//   selector: '[appErrorHandler]'
// })
// export class ErrorHandler implements AfterViewInit, OnDestroy {
//   // @Input('appErrorHandler') control!: AbstractControl | null
//   // @Input() control: AbstractControl | null = null;
//   private errorContainer: HTMLElement | null = null;
//   private subscription: Subscription = new Subscription();

//   constructor(
//     private el: ElementRef,
//     private render: Renderer2,
//     @Self() @Optional() private control: NgControl
//   ) {
//     console.log(this.control.control);
//     if (this.control) {
//       this.control.valueAccessor = this;
//     }
//     // <-- replaced subscription: use your exact condition and add it to this.subscription
//     const sub = this.control.control?.statusChanges?.subscribe((status) => {
//       console.log(status)
//       if (status === 'INVALID' && (this.control.control!.dirty || this.control.control!.touched)) {
//         this.updateErrorMessage();
//       }
//     });
//     if (sub) {
//       this.subscription.add(sub);
//     }
//   }

//   ngAfterViewInit() {
//     // this.createErrorContainer();
//   }

//   ngOnDestroy() {
//     this.subscription?.unsubscribe();
//   }

//   private createErrorContainer() {
//     console.log(this.control)
//     if (!this.errorContainer) {
//       this.errorContainer = this.render.createElement('div');
//       this.render.addClass(this.errorContainer, 'error-message');
//       this.render.setStyle(this.errorContainer, 'color', 'red');
//       this.render.setStyle(this.errorContainer, 'font-size', '12px');
//       this.render.setStyle(this.errorContainer, 'margin-top', '5px');
//       this.render.setStyle(this.errorContainer, 'display', 'none');
//       this.render.appendChild(this.el.nativeElement.parentNode, this.errorContainer);
//     }
//     if (this.control) {
//       // this.subscription = new Subscription();

//       this.subscription.add(
//         this.control.statusChanges?.subscribe((e) => {
//           this.updateErrorMessage()
//         })
//       );

//       this.subscription.add(
//         this.control.valueChanges?.subscribe((e) => {
//           this.updateErrorMessage()
//         })
//       );
//     }

//   }

//   private updateErrorMessage(): void {
//     if (this.control && this.errorContainer) {
//       const control = this.control;
//       const shouldShowError = control.invalid && (control.dirty || control.touched);

//       if (shouldShowError) {
//         const errorMessage = this.getErrorMessage(this.control);
//         this.render.setStyle(this.errorContainer, 'display', 'block');
//         this.render.setProperty(this.errorContainer, 'textContent', errorMessage || '');
//       } else {
//         this.render.setStyle(this.errorContainer, 'display', 'none');
//         this.render.setProperty(this.errorContainer, 'textContent', '');
//       }
//     }
//   }

//   private getErrorMessage(control: NgControl): string {
//     const errors = control.errors;
//     if (!errors) return '';
//     if (errors['required']) return 'This field is required.';
//     if (errors['email']) return 'Please enter a valid email address.';
//     if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength} characters.`;
//     if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength} characters.`;
//     if (errors['pattern']) return errors['pattern'].message || 'Please match the requested format.';
//     if (errors['max']) return `Value must not exceed ${errors['max'].max}.`;
//     return 'Invalid input.';
//   }
// }


import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[appErrorHandler]'
})
export class ErrorHandler implements ControlValueAccessor {

  private onChange: (value: string) => void = () => {
    //
  };
  private onTouched: () => void = () => {
    //
  };

  constructor(
    private el: ElementRef<HTMLInputElement>,
    @Optional() @Self() private control: NgControl
  ) {
    if (this.control) {
      this.control.valueAccessor = this;
      this.control?.statusChanges?.subscribe((status) => {
        console.log(status)
        // if (status === 'INVALID' && (this.control.control!.dirty || this.control.control!.touched)) {
        //   this.updateErrorMessage();
        // }
      });
    }
  }

  @HostListener('input')
  onInput(): void {

    // const transformed = target.value
    // target.value = transformed;

    // Notify form control about the change
    // this.onChange();
    console.log(this.control.status)
    console.log(this.control.value)
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string | null): void {
    this.el.nativeElement.value = value?.toUpperCase() ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

}