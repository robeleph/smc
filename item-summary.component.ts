import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import {UtilitiesService} from '../utilities.service'
import { saveAs } from 'file-saver'
@Component({
  selector: 'app-item-summary',
  templateUrl: './item-summary.component.html',
  styleUrls: ['./item-summary.component.css']
})
export class ItemSummaryComponent implements OnInit {

  accountMode: any;
  accountCode: any;
  searchKey: String;
  loader: boolean;
  itemSummary: any;
  showItemSummary: any;
  username: any;
  generalInfo: any;
  ar: any;
  name: any;
  newClearedReport: any;
  showItemSummaryTable: boolean;
  emptyMessage:boolean;
  listMenu:any;
  group:any;
  showHome:boolean;
  constructor(private dataservice: DataService,private utilities: UtilitiesService, private router: Router, private route: ActivatedRoute) { }



  ngOnInit() {
    this.username = this.dataservice.getUserName();
    this.showItemSummary = true;
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
    this.getItemSummaryReport();
  }

  getItemSummaryReport() {

    this.dataservice.getAccountModes().subscribe(data => {
      this.accountMode = data;
      this.accountCode = data[1].code;

    })
  }
  public getAccountCode(d) {

    var poCode = this.accountMode.filter(function (obj) {

      return obj.name.includes(d);
    });
    return poCode[0]['code'];
  }

  getItemSummary() {
    this.showItemSummaryTable = false;
    this.loader = true;
    this.emptyMessage = false;

    // if(this.searchKey){
    this.dataservice.getItemSummary(this.searchKey, this.getAccountCode(this.accountCode)).subscribe(data => {
      this.itemSummary = data;

      if (this.itemSummary.length > 0) {
        this.loader = false;
        // this.itemSummary = data;
        this.showItemSummaryTable = true;
        this.emptyMessage = false;
        // this.showClearedReportTable = true;


      }
      else{
        this.loader = false;
        this.showItemSummaryTable = false;
        this.emptyMessage = true;
      }

      this.newClearedReport = this.itemSummary;
    });
    // }



  }

  searchItemSummary(value: string) {
    if (value) {
      var newPurchaseList = this.newClearedReport.filter(function (obj) {
        return obj.PurchaseOrderNumber.includes(value) || obj.FullItemName.toLowerCase().includes(value) || obj.Supplier.toLowerCase().includes(value);
      });
      this.itemSummary = newPurchaseList;
    }
    if (value === "") {
      this.itemSummary = this.newClearedReport;
    }
  }


  printReport() {
    this.utilities.printReport(this.username);
    
  }
  exportToExcel() {
  this.utilities.exportToExcel(this.username);

  }
}
