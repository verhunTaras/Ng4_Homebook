import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {EventsService} from "../../shared/services/events.service";
import {CategoriesService} from "../../shared/services/categories.service";
import {WFMEvent} from "../../shared/models/event.model";
import {Category} from "../../shared/models/category.model";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'wfm-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

  event: WFMEvent;
  category: Category;

  isLoaded = false;
  sub1: Subscription;

  constructor(private route: ActivatedRoute,
              private eventsService: EventsService,
              private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.sub1 = this.route.params
      .mergeMap((params: Params) => this.eventsService.getEventById(params['id']))
      .mergeMap((event: WFMEvent) => {
        this.event = event[0];
        return this.categoriesService.getCategoryById(event[0].category);
      })
      .subscribe((category: Category) => {
              this.category = category[0];
              this.isLoaded = true;
            });
  }

  ngOnDestroy() {
    if(this.sub1) this.sub1.unsubscribe();
  }

}
