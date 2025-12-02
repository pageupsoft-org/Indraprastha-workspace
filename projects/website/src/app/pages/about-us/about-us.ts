import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiRoutes, httpGet, httpPost, IRGeneric } from '@shared';
import { error } from 'console';
import { IAboutForm } from './aboutUs.model';

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

