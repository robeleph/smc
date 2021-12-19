import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { Event } from '../field';
import { saveAs } from 'file-saver'
import { error } from 'util';
import { generate } from 'rxjs';


@Component({
  providers: [NavBarComponent],
  selector: 'app-invoice-po-event',
  templateUrl: './invoice-po-event.component.html',
  styleUrls: ['./invoice-po-event.component.css']
})
export class InvoicePoEventComponent implements OnInit {

  selectedPO: any;
  eventMenu: string;
  purchaseOrderID: string[];
  timerId;

  checker: number = 0; // check whether purchaseOrderID[] is not null
  isCAD: boolean = false;
  eventDay: any;
  eventMonth: any;
  eventYear: any;
  eventDate: any;
  message: String;
  message2: String;

  eventBeingEdited: string;
  model: any;
  model2: any;
  showLetterModal: boolean = false;
  lettername: string;
  letterNumber: string;
  performanceBondExpiryDate: string;
  bankName: string;
  cadNumber;
  latestShipmentDate;
  bankPermitNumber: string;
  firstCommonFields;

  listMenu: string[];
  userId: string;
  id: number;
  // lc and cad fields
  lcEventDate;
  lcNumber: string;
  lcOpeningDate;
  lcExpiryDate;
  lcCadNumber: string;
  cadExpiryDate;
  //
  showError:boolean;
  event: Event[] = [];
  bank;
  selectedPo: object[];
  selectedPoShipment: object[];
  addCadExtension: boolean = false;
  addLcExtension: boolean;
  loading: boolean = true;
  loadingInvoice: boolean = false;
  RPBND: boolean = false;
  closeModal: boolean = false;
  selectedPoInvoice: Object[] = [];
  selectedPoInvoiceId: string[] = [];

  orderType: any;
  code: any;
  eventMenuCode: any;
  lastRecord = 0;
  pageSize = 50;
  param: any;
  invoiceList;

  constructor(private dataservice: DataService, private toastr: ToastrService,
    private sanitizer: DomSanitizer, public navBar: NavBarComponent, private router: Router) { }

  ngOnInit() {
    this.dataservice.menuCode.subscribe(message => this.eventMenu = message);
    this.dataservice.updateId.subscribe(message => this.purchaseOrderID = message);
    this.dataservice.currentMessage.subscribe(pos => this.selectedPo = pos);
    this.dataservice.currentPoInvoice.subscribe(message => this.selectedPoInvoice = message);
    this.dataservice.updateEvent.subscribe(message => this.event = message);
    this.dataservice.updateInvoicePo.subscribe(message => this.selectedPoInvoiceId = message);
    this.param = this.router.url; // read current url for eventMenucode
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

    if (this.dataservice.isExpired()) {
      this.dataservice.logout();
    }

    this.timerId = setInterval(() => this.parseTemplate(), 1000);
    this.userId = this.dataservice.getUserID(); this.dataservice.getBankNames().subscribe(data => {
      if (data) {
        this.bank = data;
      }
    });
  }

  compare:number = -1;

  parseTemplate() {
    var lengthOfPoId = this.purchaseOrderID.length;
    if (lengthOfPoId > this.compare) {
      this.compare++;
      this.selectedPoInvoiceId = [];
    }

    var i = this.selectedPoInvoiceId.length;
    if (this.selectedPoInvoiceId.length && (i != this.checker)) {
      if (this.selectedPoInvoiceId.includes('checker')) { this.selectedPoInvoiceId.pop(); }
      this.dataservice.getInvoiceEvent(this.selectedPoInvoiceId).subscribe(data => {
        if (data) {
          this.loadingInvoice = true;
          this.selectedPO = data['eventCategories'][0]['eventDescriptions'];
          for (i = 0; i < this.selectedPO.length; i++) {
            this.letterNumber = this.selectedPO[i].letterNumber;
            this.performanceBondExpiryDate = this.selectedPO[i].performanceBondExpiryDate;
            this.bankName = this.selectedPO[i].bankName;
            this.cadNumber = this.selectedPO[i].cadNumber;
            this.cadExpiryDate = this.selectedPO[i].cadExpiryDate;
            this.lcNumber = this.selectedPO[i].lcNumber;
            this.lcExpiryDate = this.selectedPO[i].lcExpiryDate;
            this.lcOpeningDate = this.selectedPO[i].lcOpeningDate;
            this.latestShipmentDate = this.selectedPO[i].latestShipmentDate;
            this.bankPermitNumber = this.selectedPO[i].bankPermitNumber;
          }
        }
      }, error => {
        this.message2 = this.dataservice.errorCode(error.status);
           this.showError = true;
          this.loadingInvoice = true;

      });
    }
    this.checker = i;
  }

  ngOnDestroy() {
    this.selectedPO = [];
    this.purchaseOrderID = [];
    this.selectedPoInvoiceId = [];
    this.dataservice.changeMessage(this.selectedPO, this.eventMenu, this.purchaseOrderID);
    this.dataservice.changePoInvoice(this.selectedPoInvoice, this.selectedPoInvoiceId);

    clearInterval(this.timerId);
  }

  editEvent(i) {
    this.id = i.id;
    this.letterNumber = i.letterNumber;
    this.lcEventDate = this.dataservice.dateFormatWithHyphen(i.eventDate);
    this.lcExpiryDate = i.lcExpiryDate;
    this.lcNumber = i.lcNumber;
    this.lcOpeningDate = i.lcOpeningDate;
    this.cadExpiryDate = i.cadExpiryDate;
    this.bankName = i.bankName;
    this.performanceBondExpiryDate = i.performanceBondExpiryDate;
    if (i.code == "LCOPCADRV") {
      let button: HTMLElement = document.getElementById('showDialog') as HTMLElement;
      button.click();
      return this.eventBeingEdited = null;
    } else if (i.code == "LCEXTN") {
      let button: HTMLElement = document.getElementById('showDialogLCExtension') as HTMLElement;
      button.click();
      return this.eventBeingEdited = null;
    } else if (i.code == "RPBND") {
      let button: HTMLElement = document.getElementById('showDialogReleasePerformance') as HTMLElement;
      button.click();
      return this.eventBeingEdited = null;
    } else if (i.code == "CADEXTN") {
      let button: HTMLElement = document.getElementById('showDialogCadExtension') as HTMLElement;
      button.click();
      return this.eventBeingEdited = null;
    } else {
      return this.eventBeingEdited = i.id;
    }
  }
  saveEvent(i) {
    this.listMenu = this.dataservice.getListMenu();
    this.lettername = i.name;
    this.letterNumber = i.letterNumber;
    if (!this.model) {
      this.message = "Date required";
    }
    if (this.model) {
      this.eventDay = this.model.day;
      if (this.eventDay < 10) {
        this.eventDay = "0" + this.eventDay;
      }
      this.eventMonth = this.model.month;
      if (this.eventMonth < 10) {
        this.eventMonth = "0" + this.eventMonth;
      }
      this.eventYear = this.model.year;
      this.eventDate = this.eventYear + '-' + this.eventMonth + '-' + this.eventDay;
      const finalData = {
        eventDescriptionId: i.id,
        letterNumber: this.letterNumber,
        eventDate: this.eventDate,
        userId: this.userId,
        invoiceIds: this.selectedPoInvoiceId.map(Number),
      };

      if (finalData) {
        this.dataservice.saveEventShipment(finalData).subscribe(data => {
          i.eventDate = data['eventDate'];
          i.letterNumber = data['letterNumber'];
          this.cancelEvent(i); this.showSuccess();
          this.dataservice.getInvoiceList(Number(this.purchaseOrderID[this.purchaseOrderID.length - 1])).subscribe(data => {
          this.invoiceList = data;
          this.dataservice.changInvoiceList(this.invoiceList);
            console.log(this.invoiceList);
          });
        });
      }
    }
  }

  cancelEvent(i) {
    return this.eventBeingEdited = null;
  }
  showSuccess() {
    this.toastr.success('Saved Successfully!', '');
  }

  showFailure(msg: string) {
    this.toastr.warning(msg, 'Please try again');
  }
  downloadFailure() {
    this.toastr.warning('Download Failed, Please Try Again');
  }
  showModal(i) {
    this.event.push(i);
    this.dataservice.changeEvent(this.event);
    this.showLetterModal = true;
  }
}
