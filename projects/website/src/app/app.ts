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
  Toast,
} from '@shared';
import AOS from 'aos';
import { environment, IResponseGenderMenuRoot, UtilityService } from '@website/core';
import { IProfileResponse } from './components/header/profile/profile-upsert-dialog/profile-upsert-dialog.models';


@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit{
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
    const tokenData = deCodeToken()
    if(tokenData?.Id){
      const id = parseInt(tokenData?.Id)
      this.getProfileData(id)
    }
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

 public getProfileData(id:number){
    httpGet<IRGeneric<IProfileResponse[]>>(ApiRoutes.CUSTOMERS.GET_BY_ID(id), false).subscribe({
      next: (response) => {
        if(response){
          if(response.data){
            this.utilityService.profileData.set(response.data);
          }
        }
      }
    })
  }

}
