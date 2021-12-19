import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Router, NavigationExtras } from '@angular/router';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  listMenu: string[];
  generalInfo: string;
  message: string; loading: boolean = false;
  userGroup: String [];
  constructor(private dataservice: DataService, private router: Router,location: PlatformLocation) { location.onPopState(() => {
    this.dataservice.logout();
});
  }
  ngOnInit() {
    this.dataservice.getGeneralInfo().subscribe(data => {
      this.generalInfo = data['hospitalName'];
    });
  }

  login(username: string, password: string) {
    if (!username || !password) { this.message = "Username and password can not be empty."; return; }
    this.loading = true; this.message = null;

    this.dataservice.login(username, password)
      .subscribe(data => {


        // decide which user goes where depending on the eventMenus
        let navigationExtras: NavigationExtras = {
          queryParams: {
            "listMenu": JSON.stringify(this.listMenu)
          },
          skipLocationChange: true
        };
        this.listMenu = data['eventMenus'];
        this.listMenu.push(data['userId']);
        this.listMenu.push(data['groups']);

        this.listMenu.push(data['fullName']);

        this.userGroup = data['groups'];
        localStorage.setItem('listMenu', JSON.stringify(this.listMenu));
        this.dataservice.sleep(500).then(() => {
          if (this.userGroup.includes('PTI') || this.userGroup.includes('PTD')) {
            this.router.navigate(['Pre Agreement']);

          }
          else if (this.userGroup.includes('CMC') || this.userGroup.includes('CMB') || this.userGroup.includes('CMI') || this.userGroup.includes('CTA')) {
            this.router.navigate(['Post Agreement']);

          }
          else if (this.userGroup.includes('CMD') || this.userGroup.includes('SA')) {
            this.router.navigate(['main']);
            // this.router.navigate(['statusreport/poleadtime']);



          }
          else if (this.userGroup.includes('DG') || this.userGroup.includes('DPD') || this.userGroup.includes('DDF')) {
            this.router.navigate(['statusreport']);


          }
          else {
            this.router.navigate(['Shipment']);


          }

        });
      }, error => {
        
        this.loading = false;
        if ((error.status) == 404) {
          this.message = "Given username " + username + " does not exist.";
        } else if ((error.status).toString().includes(5)) {
          this.message = "There is a network error";
        } else if ((error.status) == 401) {
          this.message = "Incorrect password or username";
        } else {
          this.message = "Please try again";
        }
      }
      );
  }
}
