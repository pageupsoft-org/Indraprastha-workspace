import { Component, OnInit } from '@angular/core';
import { ApiRoutes, httpGet } from '@shared';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
})
export class AboutUs implements OnInit {

  ngOnInit(): void {
    // this.getAboutData()
  }

  //GET ABOUT DATA  
  public getAboutData() {
    httpGet<any>(
      ApiRoutes.ABOUT.GET,
      false
    ).subscribe({
      next: (res: any) => {
        if (res?.data) {

        }
      },
      error: (error) => {

      }
    })
  }

}

