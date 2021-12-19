import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import {UtilitiesService} from '../utilities.service';
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-performance-bond',
  templateUrl: './performance-bond.component.html',
  styleUrls: ['./performance-bond.component.css']
})
export class PerformanceBondComponent implements OnInit {
performanceBond:any;
loader:boolean;
newPerformanceBond:any;
username:any;
generalInfo:any;
ar:any;
name:any;
listMenu:any;
group:any;
showHome:boolean;
  constructor(private dataservice: DataService,private utilities: UtilitiesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.showPerformanceBondReport = true;
    this.loader =true;
    this.username = this.dataservice.getUserName();

    this.dataservice.getGeneralInfo().subscribe(data => {
      this.generalInfo = data['hospitalName'];
    });
    this.username = this.dataservice.getUserName();
    this.ar = this.dataservice.getListMenu();
    this.name = this.ar[this.ar.length - 1];

    if (this.dataservice.isExpired()) {
      this.dataservice.logout();
    }
    this.listMenu = this.dataservice.getListMenu();

    this.group = this.listMenu[this.listMenu.length - 2];

    if(this.group.length > 1){
      this.showHome = true;
    }

    this.getPerformanceBondReport();
  }


  getPerformanceBondReport() {
 


      this.dataservice.getPerformanceBondReport().subscribe(data => {
        if (data) {
          this.performanceBond = data;
          if (this.performanceBond) {
            this.loader = false;
          }
        
        this.newPerformanceBond = this.performanceBond;
      }
    }); 
  }

  getSearchResultforPerformanceBond(value: string) {
    if (value) {
      var newPurchaseList = this.newPerformanceBond.filter(function (obj) {

        return obj.PurchaseOrderNumber.includes(value) || obj.ReferenceNumber.toLowerCase().includes(value) || obj.NameOfBank.toLowerCase().includes(value) || obj.ValidityOfPB.includes(value) || obj.SupplierName.toLowerCase().includes(value);
      });
      this.performanceBond = newPurchaseList;
    }
    if (value === "") {
      this.performanceBond = this.newPerformanceBond;
    }
  }


  printReport() {
    this.utilities.printReport(this.username);
    
  }
  exportToExcel() {
  this.utilities.exportToExcel(this.username);

  }
}
