import { Component } from '@angular/core';
import { Navbar } from "../../../component/navbar/navbar";
import { Sidebar } from "../../../component/sidebar/sidebar";
import { Loader } from "../../../component/loader/loader";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-main-layout',
  imports: [Navbar, Sidebar, Loader, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

}
