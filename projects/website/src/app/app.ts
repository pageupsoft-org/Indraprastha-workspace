import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { HttpClient } from '@angular/common/http';
import {
  ApiRoutes,
  deCodeToken,
  FirebaseService,
  getLocalStorageItem,
  httpGet,
  IRGeneric,
  localStorageEnum,
  PlatformService,
  setHttpClient,
  setLocalStorageItem,
  Toast,
} from '@shared';
import AOS from 'aos';
import { environment, IResponseGenderMenuRoot, UtilityService } from '@website/core';
import {
  IAddressPayload,
  IProfileResponse,
} from './components/header/profile/profile-upsert-dialog/profile-upsert-dialog.models';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('Indraprastha-website');

  constructor(
    private httpClient: HttpClient,
    private firebaseService: FirebaseService,
    private platformService: PlatformService,
    private utilityService: UtilityService
  ) {
    setHttpClient(httpClient, environment.baseUrl);

    /* remove comment to use FCM, but first update keys in env file
    //  this.firebaseService.requestPermission();
    // this.firebaseService.listen();
    */

    this.checkUserLoginStatus();
    this.getGenderMenu();
  }
  ngOnInit(): void {
    setLocalStorageItem(
      localStorageEnum.token,
      'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjciLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhbWFuc2luZ0BnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYW1hbiBzaW5nIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ3VzdG9tZXIiLCJMb2dpblR5cGUiOiJDdXN0b21lciIsIkxvZ2luSWQiOiIxMiIsImp0aSI6ImVhNDQ3OTliLTIyZGEtNDI4MC05OTBjLTExZGVhZDJmM2UzMyIsImV4cCI6MTc2NTI4Mzg4OX0.9GLA0zgT-jwNd6cfg2xG1oN-hb0nYNCGh_h2f3LuhXA'
    );
  }

  ngAfterViewInit(): void {
    if (this.platformService.isBrowser) {
      AOS.init({
        once: true,
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

  private getGenderMenu() {
    httpGet<IRGeneric<IResponseGenderMenuRoot[]>>(ApiRoutes.COLLECTION.MENU, false).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.utilityService.genderMenuData.set([]);
          // this.utilityService.genderMenuData.set(response.data);
          this.utilityService.genderMenuData.set(response.data);
          // this.utilityService.genderMenuData.set(dummyDataGenderMenu.data);
        } else {
          this.utilityService.genderMenuData.set([]);
        }
      },

      error: (error) => {},
    });
  }
}
