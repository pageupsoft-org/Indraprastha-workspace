import { Directive, ElementRef, Input, Renderer2, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appErrorHandler]'
})
export class ErrorHandler implements AfterViewInit, OnDestroy {
  @Input('appErrorHandler') control!: AbstractControl | null;

  private errorContainer: HTMLElement | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private el: ElementRef, private render: Renderer2) {}

  ngAfterViewInit() {
    this.createErrorContainer();
    this.registerControlListeners();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // 👇 This catches the case when user focuses → blurs without typing
  @HostListener('blur')
  onBlur() {
    this.control?.markAsTouched();
    this.updateErrorMessage();
  }

  private createErrorContainer() {
    this.errorContainer = this.render.createElement('div');
    this.render.addClass(this.errorContainer, 'error-message');
    this.render.setStyle(this.errorContainer, 'color', 'red');
    this.render.setStyle(this.errorContainer, 'font-size', '12px');
    this.render.setStyle(this.errorContainer, 'margin-top', '5px');
    this.render.setStyle(this.errorContainer, 'display', 'none');
    this.render.appendChild(this.el.nativeElement.parentNode, this.errorContainer);
  }

  private registerControlListeners() {
    if (!this.control) return;

    this.subscription.add(
      this.control.statusChanges?.subscribe(() => this.updateErrorMessage())
    );

    this.subscription.add(
      this.control.valueChanges?.subscribe(() => this.updateErrorMessage())
    );
  }

  private updateErrorMessage() {
    if (!this.control || !this.errorContainer) return;

    const shouldShow =
      this.control.invalid && (this.control.dirty || this.control.touched);

    if (shouldShow) {
      const msg = this.getErrorMessage(this.control);
      this.render.setStyle(this.errorContainer, 'display', 'block');
      this.render.setProperty(this.errorContainer, 'textContent', msg);
    } else {
      this.render.setStyle(this.errorContainer, 'display', 'none');
      this.render.setProperty(this.errorContainer, 'textContent', '');
    }
  }

  private getErrorMessage(control: AbstractControl): string {
    const errors = control.errors;
    if (!errors) return '';
    if (errors['required']) return 'This field is required.';
    if (errors['email']) return 'Please enter a valid email address.';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength} characters.`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength} characters.`;
    if (errors['pattern']) return errors['pattern'].message || 'Please match the requested format.';
    if (errors['max']) return `Value must not exceed ${errors['max'].max}.`;
    return 'Invalid input.';
  }
}
