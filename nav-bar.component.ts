import { Component, OnInit, HostListener, Input, ViewChild, ViewContainerRef, TemplateRef, ApplicationRef } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectedInvoiceComponentComponent } from '../selected-invoice-component/selected-invoice-component.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',

  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  orderType: any;
  code: any;
  purchaseList: any;
  purchaseList2: any;
  searchList: any;
  newPurchaseList: any;
  newSearchList: any;
  selectedPoType: string;
  lastRecod: number = 0;
  purchaseOrderNumber: string;
  lastRecord = 0;
  pageSize = 50;
  param: any;
  eventMenuCode: any;
  selectedPo: Object[] = [];
  selectedPoId: string[] = [];
  selectedPoId2: string[] = [];
  loading: boolean = true;
  hidePercentage: boolean = false;
  show: boolean = false;
  poList: any;
  timerId: any;
  switch: boolean = false;
  showError: boolean;

  showList1: boolean = false;
  showList2: boolean = false;
  message: String;
  displayPo: any;
  // @Input() event: Event;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router, public appRef: ApplicationRef) { }
  ngOnInit() {
    this.dataService.currentPoList.subscribe(message => this.purchaseList = message);
    this.dataService.currentMessage.subscribe(message => this.displayPo = message);
    this.showError = false;
    this.selectedPoType = 'Select PO Type';

    this.param = this.router.url;//read current url for eventMenucode 
    switch (this.param) {
      case "/Pre%20Agreement":
        this.eventMenuCode = "PRAG";
        break;
      case "/Post%20Agreement":
        this.eventMenuCode = "POAG"
        break;
      case "/Shipment":
        this.eventMenuCode = "SHP";
        break;
    }
    if (this.param == "/Shipment") {

      this.hidePercentage = true;

    }
    this.dataService.getPurchaseOrderType().subscribe(data => {
      if (data) {
        this.orderType = data;
        this.code = data[1].code;
        this.getList(this.eventMenuCode, this.code, this.pageSize, this.lastRecod);
      }
    });
    this.dataService.currentMessage.subscribe(message => this.selectedPo = message);


    if (this.dataService.isExpired()) {
      this.dataService.logout();
    }
  }



  getList(eventMenuCode, codeType, amnt, lastRecod) {
    this.dataService.getPurchaseOrderList(eventMenuCode, codeType, amnt, lastRecod).subscribe(data => {
      var reverseList: any;
      reverseList = data;
      this.purchaseList = reverseList.reverse();
      this.loading = false;
      this.searchList = this.purchaseList;
    }, error => {
      this.message = this.dataService.errorCode(error.status);
      this.showError = true;
      this.loading = false;
      // if ((error.status) == 500) {
      // this.showError = true;

      // }
    });
  }

  onSuccess(response) {
    if (response != undefined) {
      this.purchaseList = response;
      // console.log(this.purchaseList)
    }
  }
  getCode(code, name) {
    this.selectedPoType = name;
    this.getList(this.eventMenuCode, code, 50, 0);
  }

  @HostListener('scroll', ['$event'])
  // When scroll down the side nav 
  // you're at the bottom of the page
  onScroll(event: any) {
    // visible height + pixel scrolled >= total height 


    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.getList(this.eventMenuCode, this.code, this.pageSize, 0);
      this.pageSize = this.pageSize + 100;

    }
  }



  getSearchResult(value: string) {
    // search for localPurchaseList before requesting api: 
    if (value) {
      var newPurchaseList = this.searchList.filter(function (obj) {

        return obj.purchaseOrderNumber.includes(value);
      });
      this.purchaseList = newPurchaseList;
      if (newPurchaseList.length == 0) {
        this.dataService.getSearchResult(value, this.code, this.eventMenuCode).subscribe(data3 => {
          this.purchaseList = data3;
        });
      }
    }
    if (value === "") {
      this.purchaseList = this.searchList;
    }
  }
  getIdFromPurchaseList(po) {
    var newPurchaseList = this.purchaseList.filter(function (obj) {
      return obj.purchaseOrderNumber.includes(po);
    });
    this.selectedPo.push(newPurchaseList[0]);
    var officersIds = newPurchaseList.map(function (officer) {
      return String(officer.id)
    });
    return (officersIds);
  }
  ngOnDestroy() {
    this.purchaseList = [];
    this.searchList = [];
    this.selectedPo = [];
    this.selectedPoId = [];
    this.selectedPoId2 = [];
    this.loading = false;


  }

  selectPo(e, poNumber) {
    if (e.target.checked) {
      // call the event details api based on these arrays
      const purchaseOrder = this.purchaseList.find(e => e['purchaseOrderNumber'] === poNumber);
      localStorage.setItem('termOfPayment', purchaseOrder['termOfPayment']);
      this.selectedPoId.push(this.getIdFromPurchaseList(poNumber));
      this.selectedPoId2.push(poNumber);
    }
    if (!e.target.checked) {
      var index = this.selectedPoId2.indexOf(poNumber);

      if (index > -1) {
        this.selectedPo.splice(index, 1);
        this.selectedPoId2.splice(index, 1);
        this.selectedPoId.splice(index, 1);

      }
    }
    this.dataService.changeMessage(this.selectedPo, this.eventMenuCode, this.selectedPoId);
  }
}