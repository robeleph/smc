import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import {UtilitiesService} from '../utilities.service';
import { saveAs } from 'file-saver'


@Component({
  selector: 'app-po-lead-time',
  templateUrl: './po-lead-time.component.html',
  styleUrls: ['./po-lead-time.component.css']
})
export class PoLeadTimeComponent implements OnInit {

  constructor(private dataservice: DataService,private utilities: UtilitiesService, private route: ActivatedRoute, private router: Router) { }

  poLead: any;
  selectedPo: object[];
  username: string;
  timerId;
  

  generalInfo:any;
  ar:any;
  name:any;
  showSelectMessage:boolean;

  displayLoader: boolean = false;
  displayTable: boolean = false;
  loader:boolean = true;
  newPoLead:any;
  listMenu:any;
  group:any;
  showHome:boolean;

  ngOnInit() {
    

    this.username = this.dataservice.getUserName();

    this.dataservice.getGeneralInfo().subscribe(data => {
      this.generalInfo = data['hospitalName'];
    });
    this.username = this.dataservice.getUserName();
    this.ar = this.dataservice.getListMenu();
    this.name = this.ar[this.ar.length - 1];
    // this.showSelectMessage = true;

    if (this.dataservice.isExpired()) {
      this.dataservice.logout();
    }
    this.listMenu = this.dataservice.getListMenu();

    this.group = this.listMenu[this.listMenu.length - 2];

    if(this.group.length > 1){
      this.showHome = true;
    }

    this.getPOstatus();
    
  }
  getPOstatus() {
    

      this.dataservice.getPOstatus().subscribe(data => {
        if (data) {
          this.poLead = data;
            this.loader = false;
        }
        this.newPoLead = this.poLead;
      });
    }
  
  getSearchResult(value: string) {
    if (value) {
      var newPurchaseList = this.newPoLead.filter(function (obj) {
        return obj.PurchaseOrderNumber.includes(value) || obj.Supplier.toLowerCase().includes(value) || obj.TenderNumber.toLowerCase().includes(value) || obj.ResponsiblePerson.toLowerCase().includes(value);
      });
      this.poLead = newPurchaseList;
    }
    if (value === "") {
      this.poLead = this.newPoLead;
    }
  }



  printReport() {
    this.utilities.printReport(this.username);
    
  }
  exportToExcel() {
  this.utilities.exportToExcel(this.username);

  }
}
