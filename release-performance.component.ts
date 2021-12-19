import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DataService } from '../../data.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { Event } from '../../field';


@Component({
  selector: 'app-release-performance',
  templateUrl: './release-performance.component.html',
  styleUrls: ['./release-performance.component.css']
})
export class ReleasePerformanceComponent implements OnInit {

  constructor(private dataservice: DataService, private toastr: ToastrService, public activeModal: NgbActiveModal,
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
  //lc and cad fields
  lcEventDate;
  lcNumber: string;
  lcOpeningDate;
  lcExpiryDate;
  lcCadNumber: string;
  cadExpiryDate;
  //


  eventList: Event[] = [];
  currentEvent: Event;

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
  loadingT: boolean = true;
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

  ngOnInit() {

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
    // this.dataservice.currentPoList.subscribe(message => this.purchaseList = message);
    this.dataservice.updateId.subscribe(message => this.purchaseOrderID = message);
    this.dataservice.currentMessage.subscribe(pos => this.selectedPo = pos);

    this.dataservice.updateEvent.subscribe(message => this.eventList = message);
    this.dataservice.currentMessage.subscribe(message => this.displayPo = message);

    if (this.dataservice.isExpired()) {
      this.dataservice.logout();
    }

    const eventId = localStorage.getItem('eventId');
    this.currentEvent = this.eventList.find(e =>  {
      return e.id === parseInt(eventId);
    });

    this.bankName = this.currentEvent.bankName;
    this.performanceBondExpiryDate = this.currentEvent.performanceBondExpiryDate;
    this.lcEventDate = this.currentEvent.eventDate !== null ? this.currentEvent.eventDate.split('T')[0] : '';
    this.letterNumber = this.currentEvent.letterNumber;


    this.userId = this.dataservice.getUserID(); this.dataservice.getBankNames().subscribe(data => {
      if (data) {
        this.bank = data;
      }
    });
  }

  cancelEvent(i) {
    return this.eventBeingEdited = null;
  }
  showSuccess() {
    this.toastr.success('Saved Successfully!', '');
  }
  showLoad() {
    this.toastr.info('Saving...', '');
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

  lcCad(event) {
    if (event.target.checked) {
      this.isCAD = true;
    }
    else {
      this.isCAD = false;
    }
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

    const finalData = {
      eventDescriptionId: localStorage.getItem('eventId'),
      letterNumber: this.letterNumber,
      eventDate: lcEventDate,
      userId: this.userId,
      isCad: this.isCAD === true ? true : null,
      purchaseOrderIds: this.purchaseOrderID.map(Number),
      bankName: this.bankName,
      performanceBondExpiryDate: performanceBondExpiryDate
    };
    console.log(finalData);
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
        this.RPBND = false;
        this.showFailure("There is a problem in the network ");
      });
    }
  }
}
