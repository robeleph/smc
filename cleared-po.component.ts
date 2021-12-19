import { Component, OnInit, HostListener } from '@angular/core';
import { DataService} from '../data.service';
import {UtilitiesService} from '../utilities.service'
import { Router, ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver'


@Component({
  selector: 'app-cleared-po',
  templateUrl: './cleared-po.component.html',
  styleUrls: ['./cleared-po.component.css']
})
export class ClearedPOComponent implements OnInit {
loader:boolean;
username:any;
ar:any;
name:any;
generalInfo:any;
shipmentReport:any;
newClearedReport:any;
load:boolean;
listMenu:any;
group:any;
showHome:boolean;
  constructor(private dataservice: DataService, private utilities: UtilitiesService, private router: Router, private route: ActivatedRoute) { }
  lastRecord = 0;
  pageSize = 100;
  ngOnInit() {
    
    this.loader = true;
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
    this.getClearedPOReport();
  }


  getClearedPOReport() {


    this.dataservice.getClearedReport(this.lastRecord, this.pageSize).subscribe(data => {
        this.loader = false;
        this.shipmentReport = data;



      this.newClearedReport = this.shipmentReport;
    });

  }


  getSearchClearedPO(value: String) {
    if (value) {
      var newPurchaseList = this.newClearedReport.filter(function (obj) {
        return obj.PurchaseOrderNumber.includes(value) || obj.FundingSource.toLowerCase().includes(value) || obj.Supplier.toLowerCase().includes(value) || obj.FullItemName.toLowerCase().includes(value);
      });
      this.shipmentReport = newPurchaseList;
    }
    if (value === "") {
      this.shipmentReport = this.newClearedReport;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {

        this.load = true;
        this.dataservice.getShipmentReport(this.lastRecord, this.pageSize).subscribe(data => {
          if (data) {
            this.load = false;
            this.shipmentReport = data;
  
          }
          this.newClearedReport = this.shipmentReport;
        });
        this.pageSize = this.pageSize + 50;


  

      }

    
  }
  

  
  printReport() {
    this.utilities.printReport(this.username);
    
  }
  exportToExcel() {
  this.utilities.exportToExcel(this.username);

  }
}
