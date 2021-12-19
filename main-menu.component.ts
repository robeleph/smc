import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  userWithRole: any[];
  name: string;
  listMenu = [];

  eventMenus = [];
  generalInfo: string;

  constructor(private dataservice: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.dataservice.getGeneralInfo().subscribe(data => {
      this.generalInfo = data['hospitalName'];
    });

    this.listMenu = this.dataservice.getListMenu();
    this.name = this.listMenu[this.listMenu.length - 1];

    for (let i = 0; i < this.listMenu.length - 1; i++) {
      if (this.listMenu[i].code == "PRAG") {
        this.eventMenus.push('Pre Agreement');
      } if (this.listMenu[i].code == "POAG") {
        this.eventMenus.push('Post Agreement');
      }
      if (this.listMenu[i].code == "SHP") {
        this.eventMenus.push('Shipment');
      }
    }
    if(this.dataservice.isExpired()) {
      this.dataservice.logout();
    }

  }
  logout(): void {
    this.dataservice.logout()
    this.router.navigate(['login']);
  }
}