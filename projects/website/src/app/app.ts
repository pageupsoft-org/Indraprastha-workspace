import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { HttpClient } from '@angular/common/http';
import { FirebaseService, getLocalStorageItem, localStorageEnum, PlatformService, setHttpClient, Toast } from '@shared';
import AOS from 'aos';
import { UtilityService } from './core/services/utility-service';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Indraprastha-website');

  constructor(
    private httpClient: HttpClient, 
    private firebaseService: FirebaseService,
    private platformService: PlatformService,
    private utilityService: UtilityService
  ) {
    setHttpClient(httpClient);

    /* remove comment to use FCM, but first update keys in env file
    //  this.firebaseService.requestPermission();
    // this.firebaseService.listen();
    */

    this.checkUserLoginStatus()
  }

    ngAfterViewInit(): void {
    if (this.platformService.isBrowser) {
      AOS.init({
        once: true
      });
      // AOS.refresh();
    }
  }

  private checkUserLoginStatus(): void {
    const userToken = getLocalStorageItem(localStorageEnum.token);
    if (userToken) {
      this.utilityService.isUserLoggedIn.set(true);
    } else {
      this.utilityService.isUserLoggedIn.set(false);
    }
  }
}
