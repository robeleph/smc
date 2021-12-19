import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-invoice-po-detail',
  templateUrl: './invoice-po-detail.component.html',
  styleUrls: ['./invoice-po-detail.component.css']
})
export class InvoicePoDetailComponent implements OnInit {


  purchaseOrderDetailShp: any;
  eventMenu: string;
  purchaseOrderID: string[] = [];
  commonDetail: string[];
  checker: number = 0;
  disp: boolean = false; // check whether purchaseOrderID[] is not null
  interval;
  error: boolean = false;
  selectedPoInvoiceId: string[] = [];
  loadingT: boolean = false;
  purchaseOrderDetailID: string;
  changedInvoiceId: Number;

  showNoMessage: boolean = false;
  loader: boolean = false;
  message2:String;

  constructor(private dataservice: DataService) { }
  ngOnInit() {
    this.dataservice.menuCode.subscribe(message => this.eventMenu = message);
    this.dataservice.updateId.subscribe(message => this.purchaseOrderID = message);
    this.dataservice.updateInvoicePo.subscribe(message => this.selectedPoInvoiceId = message);

    if(this.dataservice.isExpired()) {
      this.dataservice.logout();
    }

    this.interval = setInterval(() => {
      this.parseTemplate();
    }, 1000);
  }

  parseTemplate() {

    if (this.selectedPoInvoiceId.length) {
      this.loader = true;
      var i = this.selectedPoInvoiceId.length;
      if (i != this.checker) {
        var j = this.selectedPoInvoiceId[i - 1].length;
        this.purchaseOrderDetailID = this.selectedPoInvoiceId[i - 1][j - 1];
        this.dataservice.getPurchaseOrderDetailsShipment(this.purchaseOrderDetailID).subscribe(data => {

          if (data && (Object.keys(data).length != 0)) {
            this.commonDetail = data[0];
            this.purchaseOrderDetailShp = data;
            this.disp = true;
            this.loader = false;
          }
          if (data && Object.keys(data).length == 0) {
            this.disp = true;
            this.loader = false;

          }
          this.selectedPoInvoiceId = [];
          this.checker = 0;
        }, error => {
          this.error = true;
     this.message2 = this.dataservice.errorCode(error.status);

        });

      }

    }
  }



  ngOnDestroy() {
    clearInterval(this.interval);
  }

}