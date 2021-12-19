import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../data.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { Event } from '../../field';

@Component({
  selector: 'app-lc-open',
  templateUrl: './lc-open.component.html',
  styleUrls: ['./lc-open.component.css']
})
export class LcOpenComponent implements OnInit {

  constructor (private dataservice: DataService, private toastr: ToastrService, public activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer, private router: Router, public navBar: NavBarComponent, private modalService: NgbModal) { }

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


  eventList: Event[] = [];

  orderType: any;
  code: any;
  eventMenuCode: any;
  lastRecord = 0;
  pageSize = 50;
  purchaseList: any;

  bank;
  selectedPo: object[];
  addCadExtension: boolean = false;
  addLcExtension: boolean;
  loading: boolean = true;
  RPBND: boolean = false;
  closeModal: boolean = false;
  showError: boolean = false;
  loadingSave: boolean = false;
  param: any;
  displayPo: object[];

  lcExtensionshow: boolean = false;
  cadExtensionshow: boolean = false;
  lcOpenshow: boolean = false;
  releasePerformance: boolean = false;
  showDeleyance = false;
  selectedDeleyanceReason: string[] = [];
  deleyanceReasons: string[] = [];

  ngOnInit() {
    this.deleyanceReasons = [
      'Overstock',
      'Waiting for Foreign Currency',
      'Document Incompetence',
      'Fund not Reserved',
      'Contract Amendment',
      'PI Amendment'
      ];
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
    this.dataservice.menuCode.subscribe(message => this.eventMenu = message);
    this.isCAD = localStorage.getItem('termOfPayment') === 'CAD';
    this.dataservice.updateId.subscribe(message => this.purchaseOrderID = message);
    this.dataservice.currentMessage.subscribe(pos => this.selectedPo = pos);

    this.dataservice.updateEvent.subscribe(message => this.eventList = message);
    this.dataservice.currentMessage.subscribe(message => this.displayPo = message);

    if (this.dataservice.isExpired()) {
      this.dataservice.logout();
    }
    let lcopen: Event;
    const eventId  = localStorage.getItem('eventId');
    lcopen = this.eventList.find(el => el.id === parseInt(eventId));
    this.letterNumber = lcopen.letterNumber;
    this.lcEventDate = lcopen.eventDate !== null ? lcopen.eventDate.split('T')[0] : '';
    this.lcNumber = lcopen.lcNumber;
    this.bankPermitNumber = lcopen.bankPermitNumber;
    this.lcOpeningDate = lcopen.lcOpeningDate;
    this.latestShipmentDate = lcopen.latestShipmentDate;
    this.lcExpiryDate = lcopen.lcExpiryDate;
    this.cadNumber = lcopen.cadNumber;
    this.cadExpiryDate = lcopen.cadExpiryDate;

    this.userId = this.dataservice.getUserID();
    this.dataservice.getBankNames().subscribe(data => {
      if (data) {
        this.bank = data;
      }
    });
  }

  addDeleyance() {
    this.showDeleyance = !this.showDeleyance;
  }

  addSelectedDeleyance(option) {
    if (this.selectedDeleyanceReason.indexOf(option) === -1 && option !== '') {
      this.selectedDeleyanceReason.push(option);
    }
  }

  close(option) {
    const index = this.selectedDeleyanceReason.indexOf(option);
    if (index > -1) {
      this.selectedDeleyanceReason.splice(index, 1);
    }
  }

  cancelEvent(i) {
    return this.eventBeingEdited = null;
  }
  showSuccess() {
    this.toastr.success('Saved Successfully!', '');
  }
  showLoad() {
    this.toastr.info('Saving......', '');
  }


  showFailure(msg: string) {
    this.toastr.warning(msg, 'Please try again');
  }

  dateFormat(model) {
    if (model) {
      var eventDay = model.day;
      if (eventDay < 10) {
        eventDay = "0" + eventDay;
      }
      var eventMonth = model.month;
      if (eventMonth < 10) {
        eventMonth = "0" + eventMonth;
      }
      var eventYear = model.year;
      return eventDay + '/' + eventMonth + '/' + eventYear;
    } else { return ""; }
  }

  lcExtension(event) {
    if (event.target.checked) {
      this.addLcExtension = true;
      this.isCAD = false;
    }
  }
  cadExtension(event) {
    if (event.target.checked) {
      this.addCadExtension = true;
      this.isCAD = null;
    }
  }
  saveEventUnique() {
    this.RPBND = true;
    var lcEventDate = this.dataservice.dateFormatWithHyphen(this.lcEventDate);
    var lcOpeningDate = this.dataservice.dateFormatWithHyphen(this.lcOpeningDate);
    var lcLatestShipmentDate = this.dataservice.dateFormatWithHyphen(this.latestShipmentDate);
    var lcExpiryDate = this.dataservice.dateFormatWithHyphen(this.lcExpiryDate);
    var cadExpiryDate = this.dataservice.dateFormatWithHyphen(this.cadExpiryDate);
    var performanceBondExpiryDate = this.dataservice.dateFormatWithHyphen(this.performanceBondExpiryDate);
    for (var i = 0; i < this.selectedPo.length; i++) {
      if (this.selectedPo[i]['termOfPayment'] == "LC" && this.isCAD) {
        this.showFailure("Term of Payment should be of same type");
        this.RPBND = false;
        return;
      }
      if (this.selectedPo[i]['termOfPayment'] == "CAD" && !this.isCAD) {
        this.showFailure("Term of Payment should be of same type");
        this.RPBND = false;
        return;
      }
    }

    var finalData = {
      eventDescriptionId: localStorage.getItem('eventId'),
      letterNumber: this.letterNumber,
      eventDate: lcEventDate,
      userId: this.userId,
      isCad: this.isCAD,
      purchaseOrderIds: this.purchaseOrderID.map(Number),
      cadExpiryDate: cadExpiryDate,
      lcNumber: this.lcNumber,
      cadNumber: this.cadNumber,
      lcExpiryDate: lcExpiryDate,
      lcOpeningDate: lcOpeningDate,
      latestShipmentDate: lcLatestShipmentDate,
      bankPermitNumber: this.bankPermitNumber,
      bankName: this.bankName,
      performanceBondExpiryDate: performanceBondExpiryDate === '' ? null : performanceBondExpiryDate,
      addLcExtension: this.addLcExtension,
      addCadExtension: this.addCadExtension,
      delayReason: this.showDeleyance ? this.selectedDeleyanceReason.join() : null
    };


    if (finalData) {
      this.showLoad();
      this.dataservice.saveEvent(finalData).subscribe(data => {
        if (data) {
          this.RPBND = false;
          this.purchaseOrderID.push('checker');
          console.log(data)
          this.showSuccess();
          this.closeModal = true;
          if (this.closeModal) {
            let button: HTMLElement = document.getElementById('close') as HTMLElement;
            let button1: HTMLElement = document.getElementById('close1') as HTMLElement;
            let button2: HTMLElement = document.getElementById('close2') as HTMLElement;
            let button3: HTMLElement = document.getElementById('close3') as HTMLElement;
            button.click(); button1.click(); button3.click(); button2.click();
          }
        }
      }, error => {
        var n = error;
        console.log(n);
        this.RPBND = false;
        this.showFailure("There is a problem in the network ");
      });
    }
  }
}
