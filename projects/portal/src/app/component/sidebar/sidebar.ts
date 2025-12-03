import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { IMenuSideBarItem, MenuItems } from './sidebar.model';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { clearLocalStorageItems, PlatformService } from '@shared';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})

export class Sidebar implements OnInit {
  // public loginUser: IUserSession = {} as IUserSession;
  // public appRoutes = appRoutes;

  public menuItems: WritableSignal<IMenuSideBarItem[]> = signal(MenuItems);

  constructor(private router:Router, private platformService: PlatformService){}

  async ngOnInit(){
    
    if(this.platformService.isBrowser){
      await import('boxicons');
    }
  }

  // constructor(private tokenService: TokenService) {
  //   this.loginUser = this.tokenService.getDecodedToken();
  //   this.loginUser.UserType =
  //     UserRoleStringEnum[this.loginUser.UserType as keyof typeof UserRoleStringEnum];
  // }

  public logout() {
    clearLocalStorageItems();
    this.router.navigate(['login'])
  }

}
