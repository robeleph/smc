import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from '../data.service';
import {UtilitiesService} from '../utilities.service';
import { Router, ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver'


@Component({
  selector: 'app-bank-and-insurance',
  templateUrl: './bank-and-insurance.component.html',
  styleUrls: ['./bank-and-insurance.component.css']
})
export class BankAndInsuranceComponent implements OnInit {

  cad:boolean = false;
  bankandInsuranceBond:any;
  loader:boolean;
  newBankBond:any;
  username:any;
  generalInfo:any;
  ar:any;
  name:any;
  listMenu:any;
  group:any;
  showHome:boolean;


  constructor(private dataservice: DataService, private utilities: UtilitiesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
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
    this.bankandInsurance();
  }

  checkCAD(e) {
    if (e.target.checked) {
      this.cad = true;
      this.dataservice.getBankandInsurance(this.cad).subscribe(data => {
        if (data) {
          this.bankandInsuranceBond = data;
            this.loader = false;
          }
        this.newBankBond = this.bankandInsuranceBond[0]
      });
    }
    if (!e.target.checked) {
      this.cad = false;
      this.dataservice.getBankandInsurance(this.cad).subscribe(data => {
        if (data) {
          this.bankandInsuranceBond = data;
            this.loader = false;
          }
        this.newBankBond = this.bankandInsuranceBond
      });

    }
  }
  bankandInsurance() {


      this.dataservice.getBankandInsurance(this.cad).subscribe(data => {
        if (data) {
          this.bankandInsuranceBond = data;
          this.loader = false;
        }
        this.newBankBond = this.bankandInsuranceBond;
      });
 
  }

  searchBankandInsurance(value: string) {
    if (value) {
      var newPurchaseList = this.newBankBond.filter(function (obj) {
        return obj.PurchaseOrderNumber.includes(value) || obj.FundingSource.toLowerCase().includes(value) || obj.BankPermitNumber.toLowerCase().includes(value);
      });
      this.bankandInsuranceBond = newPurchaseList;
    }
    if (value === "") {
      this.bankandInsuranceBond = this.newBankBond;
    }
  }


  printReport() {
    this.utilities.printReport(this.username);
    
  }
  exportToExcel() {
  this.utilities.exportToExcel(this.username);

  }

}
