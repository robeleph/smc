import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {

  userWithRole: any[];
  name: string;
  listMenu = [];

  eventMenus = [];
  generalInfo: string;
  showHome: boolean;
  group:any;
  hideHome: boolean;
  param:any;

  constructor(private dataservice: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.param = this.router.url;//read current url for eventMenucode 

    if(this.param == '/main'){
      this.hideHome = true;
    }

    this.dataservice.getGeneralInfo().subscribe(data => {
      this.generalInfo = data['hospitalName'];
    });

    this.listMenu = this.dataservice.getListMenu();
    
    this.group = this.listMenu[this.listMenu.length - 2];
    if(this.group.length > 1){
      this.showHome = true;
    }
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