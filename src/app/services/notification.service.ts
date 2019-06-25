import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DepartureTableModel } from '../models/departure-table/departure-table-config.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public departureTableChanged = new Subject<DepartureTableModel>();
  public routeChanged = new Subject<DepartureTableModel>();
  public PolygonShapeChanged = new Subject<any>();

  constructor() { }

  public updateDepartureTable(params: DepartureTableModel): void {
    this.departureTableChanged.next(params);
  }

  public updateRoute(params: DepartureTableModel): void {
    this.routeChanged.next(params);
  }

  public UpdatePolygonShape(params: any): void {
    this.PolygonShapeChanged.next(params);
  }
}
