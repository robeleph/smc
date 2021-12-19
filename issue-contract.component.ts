import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver'
import { UtilitiesService } from '../utilities.service';

@Component({
  selector: 'app-issue-contract',
  templateUrl: './issue-contract.component.html',
  styleUrls: ['./issue-contract.component.css']
})
export class IssueContractComponent implements OnInit {

  startDateIssueContract:Date;
  endDateIssueContract: Date;
  showDateError: boolean;
  loader: boolean;
  IssueContract:any;
  showMessageNone:boolean;
  newIssueContractTableData:any;
  showIssueContractTable:boolean;
  IsshowIssueContract:boolean;
  generalInfo:any;
  ar:any;
  name:any;
  username: any;
  listMenu:any;
  group:any;
  showHome:boolean;

  constructor(private dataservice: DataService,private utilities: UtilitiesService ,private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.IsshowIssueContract = true;
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
  }
  

  getIssueContract() {
 


    if ((this.startDateIssueContract['year'] > this.endDateIssueContract['year']) || (this.startDateIssueContract['year'] == this.endDateIssueContract['year'] && this.startDateIssueContract['month'] > this.endDateIssueContract['month']) || (this.startDateIssueContract['year'] == this.endDateIssueContract['year'] && this.startDateIssueContract['month'] == this.endDateIssueContract['month'] && this.startDateIssueContract['day'] > this.endDateIssueContract['day'])) {
      this.showDateError = true;
      this.loader = false;
      this.showIssueContractTable = false;

    }
    else {
      this.showDateError = false;
    }



    if (!this.showDateError) {
    

      this.loader = true;
      this.showIssueContractTable = false;

      this.dataservice.getIssueContract(this.dataservice.dateFormatWithHyphen(this.startDateIssueContract), this.dataservice.dateFormatWithHyphen(this.endDateIssueContract)).subscribe(data => {
        this.showIssueContractTable = false;

        if (data) {
          this.IssueContract = data;
          this.showMessageNone = false;
          this.showIssueContractTable = true;
          this.loader = false;
          this.newIssueContractTableData = this.IssueContract;
          

        }
        else {
          this.loader = false;
          this.showMessageNone = true;
          this.showIssueContractTable = false;


        }

      });
    }


  }
  searchIssueContract(value: string) {
    if (value) {
      var newPurchaseList = this.newIssueContractTableData.filter(function (obj) {
        return obj.PurchaseOrderNumber.includes(value) || obj.TenderNumber.toLowerCase().includes(value) || obj.Supplier.toLowerCase().includes(value) || obj.ResponsiblePerson.toLowerCase().includes(value);
      });
      this.IssueContract = newPurchaseList;
    }
    if (value === "") {
      this.IssueContract = this.newIssueContractTableData;
    }
  }

  

  printReport() {
    this.utilities.printReport(this.username);
    
  }
  exportToExcel() {
  this.utilities.exportToExcel(this.username);

  }
}
