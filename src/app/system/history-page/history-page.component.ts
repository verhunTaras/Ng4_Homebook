import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';

import {CategoriesService} from '../shared/services/categories.service';
import {EventsService} from '../shared/services/events.service';
import {Category} from '../shared/models/category.model';
import {WFMEvent} from '../shared/models/event.model';

@Component({
  selector: 'wfm-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  constructor(private caregoriesService: CategoriesService,
              private eventsService: EventsService) { }

  isLoaded = false;
  sub1: Subscription;

  categories: Category[] = [];
  events: WFMEvent[] = [];
  filteredEvents: WFMEvent[] = [];

  chartData = [];

  isFilterVisible = false;

  ngOnInit() {
    this.sub1 = Observable.combineLatest(
      this.caregoriesService.getCategories(),
      this.eventsService.getEvents()
    ).subscribe((data: [Category[], WFMEvent[]]) => {
      this.categories = data[0];
      this.events = data[1];

      this.setOriginalEvents();
      this.calculateChartData();


      this.isLoaded = true;
    });
  }

  private setOriginalEvents() {
    this.filteredEvents = this.events.slice();
  }

  calculateChartData(): void {
    this.chartData = [];
    this.categories.forEach((cat) => {
      const catEvents = this.filteredEvents.filter((e) => e.category === cat.id && e.type === 'outcome');
      this.chartData.push({
        name: cat.name,
        value: catEvents.reduce((total, e) => {
          total += e.amount;
          return total;
        }, 0)
      });
    });
  }

  private toggleFilterVisibility(dir: boolean) {
    this.isFilterVisible = dir;
  }

  openFilter() {
    this.toggleFilterVisibility(true);
  }

  onFilterApply(filterData) {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();

    const startPeriod = moment().startOf(filterData.period).startOf('d');
    const endPeriod = moment().endOf(filterData.period).endOf('d');

    this.filteredEvents = this.filteredEvents
      .filter((e) => {
        return filterData.types.indexOf(e.type) !== -1;
      })
      .filter((e) => {
        return filterData.categories.indexOf(e.category.toString()) !== -1;
      })
      .filter((e) => {
        const momentDate = moment(e.date, 'DD.MM.YYYY HH:mm:ss');
        return momentDate.isBetween(startPeriod, endPeriod);
      });
    console.log(this.filteredEvents)

    this.calculateChartData();
  }

  onFilterCancel() {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();
    this.calculateChartData();
  }

  ngOnDestroy() {
    if (this.sub1) { this.sub1.unsubscribe(); }
  }

}
