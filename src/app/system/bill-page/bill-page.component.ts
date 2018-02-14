import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {BillService} from '../shared/services/bill.service';
import {Bill} from '../shared/models/bill.model';


@Component({
  selector: 'wfm-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent implements OnInit, OnDestroy {
  sub1: Subscription;
  sub2: Subscription;

  currency = {
    date: '',
    rates: {}
  };
  bill: Bill;
  isLoaded = false;

  constructor(private billService: BillService) { }

  ngOnInit() {

    this.sub1 =  Observable.combineLatest(
      this.billService.getBill(),
      this.billService.getCurrency()
    ).subscribe((data: [Bill, any]) => {
      this.bill = data[0][0];
      this.formatCurrencyData(data[1]);

      this.isLoaded = true;
    });

  }

  private formatCurrencyData(data) {
    this.currency.date = data[0]['exchangedate'];
    data.forEach(e => {
      if ( e.cc === 'EUR' ) {this.currency.rates['EUR'] = 1 / e.rate; }
      if ( e.cc === 'USD' ) {this.currency.rates['USD'] = 1 / e.rate; }
    });
  }

  onRefresh() {
    this.isLoaded = false;
    this.sub2 = this.billService.getCurrency()
      .subscribe((currency: any) => {
        this.formatCurrencyData(currency);
        this.isLoaded = true;
      });
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    if (this.sub2) { this.sub2.unsubscribe(); }
  }

}
