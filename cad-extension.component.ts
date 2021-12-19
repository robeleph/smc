import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../data.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';


@Component({
  selector: 'app-cad-extension',
  templateUrl: './cad-extension.component.html',
  styleUrls: ['./cad-extension.component.css']
})
export class CadExtensionComponent implements OnInit {

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


  event: Object[] = [];

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

  currentEvent: object[];
  cadExtensionshow: boolean;
  lcOpenshow: boolean = false;
  releasePerformance: boolean = false;

  constructor(private dataservice: DataService, private toastr: ToastrService, private sanitizer: DomSanitizer,
    public activeModal: NgbActiveModal, private router: Router, public navBar: NavBarComponent, private modalService: NgbModal) { }

  ngOnInit() {
    this.currentEvent = this.dataservice.getCurrentEvent();
    if (this.currentEvent['cadExpiryDate'] !== null) {
      this.cadExtensionshow = true;
    }

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
    this.dataservice.updateId.subscribe(message => this.purchaseOrderID = message);
    this.dataservice.currentMessage.subscribe(pos => this.selectedPo = pos);
    this.dataservice.updateEvent.subscribe((message) => this.event = message);
    this.dataservice.currentMessage.subscribe(message => this.displayPo = message);

    if (this.dataservice.isExpired()) {
      this.dataservice.logout();
    }

    this.userId = this.dataservice.getUserID(); this.dataservice.getBankNames().subscribe(data => {
      if (data) {
        this.bank = data;
      }
    });
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

      var finalData = {
        eventDescriptionId: localStorage.getItem('eventId'),
        letterNumber: this.letterNumber,
        eventDate: this.eventDate,
        userId: this.userId,
        purchaseOrderIds: this.purchaseOrderID.map(Number),
        isCad: null,
        // performanceBondExpiryDate: 'df',
        // bankName: 'df',
        // cadNumber: 'df',
        // cadExpiryDate: 'df',
        // lcNumber: 'df',
        // lcExpiryDate: 'df',
        // lcOpeningDate: 'df',
        // latestShipmentDate: 'df',
        // bankPermitNumber: 'df'
      };


      if (finalData) {
        this.loadingSave = true;
        this.dataservice.saveEvent(finalData).subscribe(data => {
          i.eventDate = data['eventDate'];
          i.letterNumber = data['letterNumber'];
          this.cancelEvent(i);
          this.showSuccess();
          // this.purchaseList = this.poList;
          // this.dataservice.changPoList(this.purchaseList)
          this.dataservice.getPurchaseOrderType().subscribe(data => {
            if (data) {
              this.orderType = "STD"
              this.orderType = data;
              this.code = data[1].code;//def
            }
          });
          this.dataservice.getPurchaseOrderList(this.eventMenuCode, "STD", this.pageSize, this.lastRecord).subscribe(data => {

            this.purchaseList = data;

            // var poId = this.selectedPo[0]['purchaseOrderNumber']
            this.dataservice.changPoList(this.purchaseList);
            // console.log(poId)

            // let checkBox: HTMLElement = document.getElementById(poId) as HTMLElement;
            // checkBox.click();


          }, error => {
            this.showFailure('Refresh Failed');
          });

        }, error => {
          this.showFailure('Saving Failed, Try again');
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
    } else { return "";}
  }

  lcCad(event) {
    if (event.target.checked) {
      this.isCAD = true;
    } else {
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
    console.log(this.selectedPo);
    this.RPBND = true;
    var lcEventDate = this.dataservice.dateFormatWithHyphen(this.lcEventDate);
    for (var i = 0; i < this.selectedPo.length; i++) {
      if (this.selectedPo[i]['termOfPayment'] == "LC") {
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
      isCad: this.isCAD ? true : null,
      purchaseOrderIds: this.purchaseOrderID.map(Number),
      lcExpiryDate: lcEventDate,
      latestShipmentDate: lcEventDate,
      addCadExtension: this.addCadExtension ? true : false,
    };

    if (finalData) {
      this.showLoad();
      this.dataservice.saveEvent(finalData).subscribe(data => {
        if (data) {
          this.RPBND = false;
          this.purchaseOrderID.push('checker');
          this.showSuccess();
          this.closeModal = true;
          if (this.closeModal) {
            const button: HTMLElement = document.getElementById('close3') as HTMLElement;
            button.click();
          }
        }
      }, error => {
        var n = error;
        this.RPBND = false;
        this.showFailure(n.error.errors[0]);
      });
    }
  }
}
