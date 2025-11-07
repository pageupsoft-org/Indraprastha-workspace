import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { IMenuSideBarItem, MenuItems } from './sidebar.model';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,  
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  // public loginUser: IUserSession = {} as IUserSession;
  // public appRoutes = appRoutes;

  public menuItems: WritableSignal<IMenuSideBarItem[]> = signal(MenuItems);

  // constructor(private tokenService: TokenService) {
  //   this.loginUser = this.tokenService.getDecodedToken();
  //   this.loginUser.UserType =
  //     UserRoleStringEnum[this.loginUser.UserType as keyof typeof UserRoleStringEnum];
  // }
}
