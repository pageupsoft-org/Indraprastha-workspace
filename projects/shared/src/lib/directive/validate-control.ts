import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  HostListener,
  Optional,
} from '@angular/core';
import { AbstractControl, FormGroupDirective, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { trimFormValue } from '../utils/utility.util';

@Directive({
  selector: '[libValidateControl]',
})
export class ValidateControl implements AfterViewInit, OnDestroy {
  private errorContainer!: HTMLElement;
  private sub = new Subscription();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Optional() private ngControl: NgControl,
    @Optional() private formGroupDir: FormGroupDirective
  ) {
    console.log(ngControl, formGroupDir)
  }

  ngAfterViewInit() {

    if (!this.ngControl || !this.ngControl.control) return;

    this.wrapInputInRelativeContainer();
    this.createErrorToast();
    this.registerListeners();

    if (this.formGroupDir) {
      this.sub.add(
        this.formGroupDir.ngSubmit.subscribe(() => {
          // this.formGroupDir.directives.filter(control => {
          //   console.log(control)
          //    const rawValue = control.value;
          //    console.log(rawValue)
          //    const trimValue = String(rawValue).trim(); 
          //    console.log(trimValue)
          // })
          trimFormValue(this.ngControl)
          this.formGroupDir.control.markAllAsTouched();
          this.updateMessage();
        })
      );
    }
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /** When input loses focus */
  @HostListener('blur')
  onBlur() {
    const control = this.ngControl.control;
    if (!control) return;

    control.markAsTouched();
    this.updateMessage();
  }

  /** Wrap input to allow absolute-positioned toast above */
  private wrapInputInRelativeContainer() {
    const inputEl = this.el.nativeElement;
    const parent = inputEl.parentNode;

    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'position', 'relative');
    this.renderer.setStyle(wrapper, 'width', '100%');

    parent.replaceChild(wrapper, inputEl);
    wrapper.appendChild(inputEl);
  }

  private createErrorToast() {
    this.errorContainer = this.renderer.createElement('div');

    this.renderer.addClass(this.errorContainer, 'input-error-toast');
    this.renderer.setStyle(this.errorContainer, 'position', 'absolute');
    this.renderer.setStyle(this.errorContainer, 'top', '-28px');
    this.renderer.setStyle(this.errorContainer, 'left', '0');
    this.renderer.setStyle(this.errorContainer, 'background', '#ff4d4f');
    this.renderer.setStyle(this.errorContainer, 'color', '#fff');
    this.renderer.setStyle(this.errorContainer, 'font-size', '12px');
    this.renderer.setStyle(this.errorContainer, 'padding', '4px 8px');
    this.renderer.setStyle(this.errorContainer, 'border-radius', '4px');
    this.renderer.setStyle(this.errorContainer, 'display', 'none');
    this.renderer.setStyle(this.errorContainer, 'z-index', '10');
    this.renderer.setStyle(this.errorContainer, 'transition', 'opacity 0.2s ease');
    this.renderer.setStyle(this.errorContainer, 'opacity', '0');

    const wrapper = this.el.nativeElement.parentNode;
    this.renderer.appendChild(wrapper, this.errorContainer);
  }

  private registerListeners() {
    const control = this.ngControl.control;
    if (!control) return;

    this.sub.add(control.valueChanges?.subscribe(() => this.updateMessage()));
    this.sub.add(control.statusChanges?.subscribe(() => this.updateMessage()));
  }

  private updateMessage() {
    const control = this.ngControl.control;
    if (!control) return;

    const shouldShow = control.invalid && (control.touched || control.dirty);

    if (shouldShow) {
      const msg = this.getError(control);
      this.renderer.setProperty(this.errorContainer, 'textContent', msg);
      this.renderer.setStyle(this.errorContainer, 'display', 'block');
      setTimeout(() => this.renderer.setStyle(this.errorContainer, 'opacity', '1'), 10);
    } else {
      this.renderer.setStyle(this.errorContainer, 'opacity', '0');
      setTimeout(() => {
        this.renderer.setStyle(this.errorContainer, 'display', 'none');
      }, 200);
    }
  }

  private getError(control: AbstractControl): string {
    const e = control.errors;

    if (!e) return '';

    if (e['required']) return 'This field is required.';
    if (e['email']) return 'Please enter a valid email.';
    if (e['minlength']) return `Minimum length is ${e['minlength'].requiredLength}.`;
    if (e['maxlength']) return `Maximum length is ${e['maxlength'].requiredLength}.`;
    if (e['pattern']) return e['pattern'].message || 'Invalid format.';
    if (e['max']) return `Value must not exceed ${e['max'].max}.`;
    if (e['leadingOrTrailingSpace']) return `Starting and ending space not allowed`
    return 'Invalid input.';
  }
}
