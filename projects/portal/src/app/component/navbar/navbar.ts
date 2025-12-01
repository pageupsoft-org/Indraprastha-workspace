import { Component, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { clearLocalStorageItems } from '@shared';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  public dropDownOpen : boolean = false;

  constructor(private router:Router){
  }

  public toggleDropDown(){
    this.dropDownOpen = !this.dropDownOpen
  }
  
  public logout(){
    clearLocalStorageItems();
    this.router.navigate(['login'])
  }
}
