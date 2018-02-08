import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";

import {WFMEvent} from "../models/event.model";
import {BaseApi} from "../../../shared/core/base-api";

@Injectable()
export class EventsService extends BaseApi{
  constructor(public http: Http){
    super(http);
  }

  addEvent (event: WFMEvent): Observable<WFMEvent> {
    return this.post('events', event);
  }


}
