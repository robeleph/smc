import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver'
import { ComponentRef } from '@angular/core/src/render3';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ActivatedRoute, Router } from '@angular/router';
import {Field} from '../field';


@Component({
  selector: 'app-letter-modal',
  templateUrl: './letter-modal.component.html',
  styleUrls: ['./letter-modal.component.css']
})
export class LetterModalComponent implements OnInit, OnDestroy {
  eventMenu: string;
  purchaseOrderID: string[];
  timerId;

  showTable: boolean = false;
  clauses: any[] = [];
  eventDay: any;
  eventMonth: any;
  eventYear: any;
  eventDate: any;
  message: string;
  eventBeingEdited: string;
  model: any;
  model2: any;

  lettername: string;
  field;
  letterNumber: string;

  listMenu: string[];
  userId: string;
  fields: any[];
  letterData;
  id: number;

  fieldsAreValid: boolean;

  letterInfo: string;
  showGenerate: boolean = false;
  showNext: boolean = false;
  showPrevious: boolean = false;
  selectedPo: object[];
  index: number = -1;
  loading: boolean = true;
  loadingGenerate: boolean = true;

  poIndex:number;

  file;
  c: {};

  poID: number;
  commonFields: any[];
  generalFields: any[];

  event: Object[];
  selectedEvent: {};
  param: any;

  @Output() close = new EventEmitter();


  constructor(private dataservice: DataService, private toastr: ToastrService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.param = this.router.url;//read current url for eventMenucode 
    this.c = {}
    this.commonFields = [];
    this.selectedEvent = {};
    this.dataservice.menuCode.subscribe(message => this.eventMenu = message);
    this.dataservice.updateId.subscribe(message => this.purchaseOrderID = message);
    this.dataservice.currentMessage.subscribe(pos => this.selectedPo = pos);
    this.dataservice.updateEvent.subscribe(message => this.event = message);
    this.userId = this.dataservice.getUserID();
    this.selectedEvent = this.event[this.event.length - 1];
    this.generateLetterForEvent(this.selectedEvent);
    if(this.dataservice.isExpired()) {
      this.dataservice.logout();
    }

  }


  ngOnDestroy() {
    // this.dataservice.changeMessage(this.selectedPO, this.eventMenu, this.purchaseOrderID);
    // console.log('lkdj')
    // clearInterval(this.timerId);
  }

  destroyIt() {
    this.close.emit(null);
  }
  generateLetterForEvent(i) {
    this.loading = true;
    this.fields = [];
    this.poIndex = 0;
    this.lettername = this.selectedEvent['name'];
    this.id = this.selectedEvent['id'];

    
    this.selectedPo.forEach((element, key) => {
      element['fieldsValue'] = [];
      this.dataservice.getLetterFields(i.id, element['id']).subscribe(data => {
        this.onSuccess(data);
        this.dataservice.sleep(2000).then(() => {
          if (this.fields && this.fields.length > 0) {

            if (this.fields.length == 2) {
              this.fieldsAreValid = true;
            }
            else {
              this.fieldsAreValid = false;
            }
            for (var k = 0; k < this.fields.length; k++) {
              this.field = this.fields[k];
              if (this.field.options != null && this.field.options.length > 0) {
                this.field.type = 'dropdown';
              } else if (this.field.name && (this.field.name.indexOf('Date') != -1 || this.field.name.indexOf('date') != -1)) {
                if (this.field.name && (this.field.name.indexOf('DateRange') != -1 || this.field.name.indexOf('dateRange') != -1 || this.field.name.indexOf('daterange') != -1)) {
                  this.field.type = 'dateRange';
                } else {
                  this.field.type = 'date';
                }
              } else if (this.field.name && (this.field.name.indexOf('ClauseNumber') != -1 || this.field.name.indexOf('clausenumber') != -1)) {
                this.field.type = 'clausenumber';
              }
              else if (this.field.name && (this.field.name.indexOf('clause') != -1 || this.field.name.indexOf('Clause') != -1)) {
                this.field.type = 'clause'
              }
              else {
                this.field.type = 'text';
              }
              if (this.field.name != 'LetterNumber' && this.field.name != 'LetterDate' && this.field.name != 'Clause' && this.field.name != 'ClauseNumber') {
                this.field.required = true;
              }
              else {
                this.field.required = false;
              }
            
              if (this.poIndex == 0 && this.field.isCommon) {
                this.commonFields.push(this.field);
                this.loading = false;
              }
              if (!this.field.isCommon) {
                var fieldObject: Field = 
                   {
                    name: this.field['name'] ,
                    type: this.field['type'],
                    options:  this.field['options'], 
                    isCommon: this.field['isCommon'],
                    Value: null
                  }
              



                element['fieldsValue'].push(fieldObject);
                 this.loading = false;
              }
              
          
            }
            if (this.commonFields.length > 2) {
              this.fieldsAreValid = false;
            }
            else {
              this.fieldsAreValid = true;
            }
          }
          this.poIndex++;
          
        });
      });
    });
    this.generalFields = this.commonFields;
    
  }

  // trackByFunction(index, field){
  //   if(!field) return null;
  //   return index;

  // }
  fieldChanged(generalFields) {
    for (var i = 0; i < generalFields.length; i++) {
      var field = generalFields[i];
      if (field.required && (field.Value == null || field.Value.toString() == "")) {
        this.fieldsAreValid = false;
        break;
      }
      else {
        if (field.type == 'dateRange' && (field.Value.endDate == null || field.Value.startDate == null)) {
          this.fieldsAreValid = false;
          break;
        }
        this.fieldsAreValid = true;
      }
    }

  }

  dateFormat(model) {
    if (typeof (model) == "string") {
      return model
    } else {
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
    }
  }

  addClause(c) {
    this.showTable = true;
    if (c['clauseText'] != "" && c['clauseNumber'] != "") {
      this.clauses.push(c);
      this.c = {};
    }


  };

  onSuccess(response) {
    if (response != undefined) {
      this.fields = response;
    }
  }
  next() {
   
    if (this.fieldsAreValid) {
      if (this.index < this.selectedPo.length - 1) {
        this.index++;
        this.showPrevious = true;
        if (!this.selectedPo[this.index]['fieldsValue'].length) {

          this.next();
        } else {
          this.generalFields = this.selectedPo[this.index]['fieldsValue'];
          
        }
      }
      else {
        this.showGenerate = true;
      }
    }
  }


  previous() {

    this.showGenerate = false;
    if (this.index >= 0) {
      this.index--;
      if (this.index < 0) {
        this.showPrevious = false;
        this.generalFields = this.commonFields;
      }
      else {
        if (!this.selectedPo[this.index]['fieldsValue'].length) {
          this.previous();
        }
        this.generalFields = this.selectedPo[this.index]['fieldsValue'];
      }
    }
  }



  formatFields(field) {
    if (this.fieldsAreValid) {
      var letterInputs: object[] = [];

      var finalData = {}
      this.selectedPo.forEach((element) => {
        var f = {};
        f['purchaseOrderId'] = element['id']
        f['clauses'] = this.clauses;
        f['fields'] = element['fieldsValue'].concat(this.commonFields);
        for (var i = 0; i < f['fields'].length; i++) {
          if (f['fields'][i].type == 'date') {
            if (f['fields'][i].Value != null) {
              f['fields'][i].Value = this.dateFormat(f['fields'][i].Value);

            }
          }
          else if (f['fields'][i].type == 'dateRange') {
            var startDate = this.dateFormat(f['fields'][i].Value.startDate);
            var endDate = this.dateFormat(f['fields'][i].Value.endDate);
            f['fields'][i].Value = startDate + "-" + endDate
          }
          else if (f['fields'][i].name == 'LetterNumber') {
            if (f['fields'][i].Value == null) {
              f['fields'][i].Value = null;
            }
          } else if (f['fields'][i].name == 'LetterDate') {
            if (f['fields'][i].Value == null) {
              f['fields'][i].Value = null;
            }
          }
          else if (f['fields'][i].type == 'clause' || f['fields'][i].type == 'ClauseNumber') {
            f['fields'][i].Value = " ";
          }
        }
        letterInputs.push(f);
      });
      finalData = {
        eventDecriptionId: this.id,
        userId: this.userId,
        letterInputs: letterInputs
      }
    }
    this.generateLetter(finalData)
  }
  generateLetter(finalData) {
    if (this.param == "/Shipment") {
      this.loading = true;
      this.dataservice.generateLetterShipment(finalData).subscribe(data => {
        if (data) {
          this.letterData = new Uint8Array(data);
          this.file = new Blob([this.letterData], { type: "application/msword" });
          saveAs(this.file, this.lettername);
          this.loading = false;
          let button: HTMLElement = document.getElementById('generateModalClose') as HTMLElement;
          button.click();
          this.destroyIt();
        }
      }, error => {
        var n = error;
        this.downloadFailure();
        let button2: HTMLElement = document.getElementById('generateModalClose') as HTMLElement;
        button2.click();
        this.destroyIt();
      });
    } else {
      this.loading = true;
      this.dataservice.generateLetter(finalData).subscribe(data => {
        if (data) {
          this.letterData = new Uint8Array(data);
          this.file = new Blob([this.letterData], { type: "application/msword" });
          saveAs(this.file, this.lettername);
          this.loading = false;
          let button: HTMLElement = document.getElementById('generateModalClose') as HTMLElement;
          button.click();
          this.destroyIt();
        }
      }, error => {
        var n = error;
        this.downloadFailure();
        let button: HTMLElement = document.getElementById('generateModalClose') as HTMLElement;
        button.click();
        this.destroyIt();
      });
    }
  }

  downloadFailure() {
    this.toastr.warning('Download Failed, Please Try Again')
  }
}
