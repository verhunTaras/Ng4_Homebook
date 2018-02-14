import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs/Subscription";
import * as moment from 'moment';

import {Category} from "../../shared/models/category.model";
import {WFMEvent} from "../../shared/models/event.model";
import {EventsService} from "../../shared/services/events.service";
import {BillService} from "../../shared/services/bill.service";
import {Bill} from "../../shared/models/bill.model";
import {Message} from "../../../shared/models/message.model";

@Component({
  selector: 'wfm-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {

  sub1: Subscription;
  sub2: Subscription;

  @Input() categories: Category[] = [];
  types = [
    {type: 'income', label: 'Дохід'},
    {type: 'outcome', label: 'Витрати'}
  ]

  message: Message;

  events: WFMEvent[] = [];
  event_id;

  constructor(
    private eventsService: EventsService,
    private billService: BillService
  ) { }

  ngOnInit() {
    this.message = new Message('danger', '');

    this.eventsService.getEvents()
      .subscribe(events => {
        this.events = events;
        this.event_id = this.events.length + 1;
      })
  }

  private showMessage(text: string){
    this.message.text = text;
    window.setTimeout(() => this.message.text = '', 5000);
  }

  onSubmit(form: NgForm ) {
    let {amount, description, category, type} = form.value;
    if (amount < 0) amount *= -1;

    const event = new WFMEvent(
      type, amount, +category,
      moment().format('DD.MM.YYYY HH:mm:ss'), description, this.event_id
    );

    this.sub1 = this.billService.getBill()
      .subscribe((billArr: Bill) => {
        const bill = billArr[0];
        let value = 0
        if(type === 'outcome') {
          if(amount > bill.value) {
            this.showMessage(`На рахунку недостатньо коштів. Вам не вистачає ${amount - bill.value} UAH`);
            return;
          } else {
            value = bill.value - amount;
          }
        } else {
          value = bill.value + amount;
        }

        this.sub2 = this.billService.updateBill({
          value: value,
          currency: bill.currency
        }).mergeMap(() => this.eventsService.addEvent(event))
          .subscribe(() => {
            form.setValue({
              amount: 0,
              description: ' ',
              category: 1,
              type: 'outcome'
            })
          })

      });
  }

  ngOnDestroy() {
    if (this.sub1) {this.sub1.unsubscribe();}
    if (this.sub2) {this.sub2.unsubscribe();}
  }

}
