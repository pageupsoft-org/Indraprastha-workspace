import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { Login } from './login/login';
import { EAuthManager } from '../../core/enum/auth-manager.enum';
import { Register } from './register/register';
import { CommonModule } from '@angular/common';
import { UtilityService } from '../../core/services/utility-service';

@Component({
  selector: 'app-auth-manager',
  imports: [Login, Register, CommonModule],
  templateUrl: './auth-manager.html',
  styleUrl: './auth-manager.scss',
})
export class AuthManager {
  @ViewChild('loginContainer') loginContainer!: ElementRef;
  @ViewChild('loginForm') loginForm!: ElementRef;

  public currentAuthView = signal<EAuthManager>(EAuthManager.login);
  public isShowLoader = signal<boolean>(false);

  public readonly EAuthManager = EAuthManager;

  constructor(private utilService: UtilityService) {
    utilService.openLoginForm.subscribe(() => {
      this.openForm();
    });
  }

  public openForm() {
    const container = this.loginContainer.nativeElement;
    const form = this.loginForm.nativeElement;

    container.classList.remove('hidden');

    // small delay to allow CSS transition
    setTimeout(() => {
      form.classList.remove('translate-x-full');
    }, 10);
  }

  public closeForm() {
    const container = this.loginContainer.nativeElement;
    const form = this.loginForm.nativeElement;

    form.classList.add('translate-x-full');

    // wait for the animation to finish
    setTimeout(() => {
      container.classList.add('hidden');
    }, 500);
  }
}
