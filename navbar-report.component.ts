import { Component, OnInit, EventEmitter, Output, ApplicationRef } from '@angular/core';

import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';

import { StatusReportComponent } from '../status-report/status-report.component';

@Component({
  providers: [StatusReportComponent],

  selector: 'app-navbar-report',
  templateUrl: './navbar-report.component.html',
  styleUrls: ['./navbar-report.component.css']
})
export class NavbarReportComponent implements OnInit {


  selectedPoStatus: boolean = false;
  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router, public statusReport: StatusReportComponent, public appRef: ApplicationRef) { }


  ngOnInit() {
    
    document.getElementById('preag').click();
  

    
  }         
          


}
