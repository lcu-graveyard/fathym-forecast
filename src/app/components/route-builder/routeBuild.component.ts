import { DepartureTableModel } from './../../models/departure-table/departure-table-config.model';

import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'route-build',
    templateUrl: './routeBuild.component.html',
    styleUrls: ['./routeBuild.component.css']
})

export class RouteBuildComponent  {

    @Output() route = new EventEmitter();
    @Output() departTimes = new EventEmitter();

    points = [];

	constructor(private notificationService: NotificationService) {

	}

    isValid() {
	if (this.points.length < 2) {
	    return false;
	}
	return true;
    }

    deletePoint(idx:number) {
	this.points.splice(idx, 1);
    }
    
    addPoint(lat:number, lon:number, speed:number) {
	this.points.push({
	    lat:lat,
	    lon:lon,
	    speed:speed
	});
    }
    
    routeClick() {
	if (!this.isValid()) {
	    return;
	}
	this.route.emit();
    }

    departTimesClick() {
	if (!this.isValid()) {
	    return;
	}
	// this.departTimes.emit();

		this.notificationService.updateDepartureTable(
			new DepartureTableModel('39.73845,-104.98485', '40.58897,-105.08246', '1545937200', false)
		);
    }

    getRoutePoints() {
	let latlons = [[this.points[0].lat, this.points[0].lon]];
	let now = (new Date()).getTime() / 1000;
	let vtimes = [now];
	for (var i = 1; i < this.points.length; i++) {
	    let pt1 = this.points[i-1];
	    let pt2 = this.points[i];
	    let spd = pt2.speed;
	    let d = this.distance(pt1.lat, pt1.lon, pt2.lat, pt2.lon, 'M');
	    let time = d / spd;
	    
	    latlons.push([pt2.lat,pt2.lon]);
	    vtimes.push(now+time);
	}
	return {
	    latlons:latlons,
	    valid_times:vtimes
	};
    }
    
    distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}
}
