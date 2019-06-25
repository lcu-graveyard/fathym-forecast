import { Const } from './../../utils/constants/const';
import { LocationResults } from '../../models/departure-table/location-results.model';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';
import { DepartureTableModel } from '../../models/departure-table/departure-table-config.model';
import { NotificationService } from '../../services/notification.service';
import { LocationModel } from '../../models/departure-table/location.model';

@Component({
    selector: 'route-input',
	templateUrl: './routeInput.component.html',
	styleUrls: ['./routeInput.component.css']
})

export class RouteInputComponent implements OnInit  {

    @Input() lbsKey: string;
    @Output() route = new EventEmitter();
    @Output() departTimes = new EventEmitter();

	public RouteInputForm: FormGroup;
	public originRoute: Observable<LocationModel>;
	public destinationRoute: Observable<LocationModel>;
	
	public WCSearchConstantDeparturTable: string;
	public WCSearchConstantRoute: string;

	public varNamesList: Array<object> = Const.VAR_NAMES_SELECT;

	protected _origin: string;
	protected _destination: string;
	protected _showAlternatives: boolean;

	set origin(val: string) {
		this._origin = val;
	}
	get origin(): string {
		return this._origin;
	}

	set destination(val: string) {
		this._destination = val;
	}
	get destination(): string {
		return this._destination;
	}

	set showAlternatives(val: boolean) {
		this._showAlternatives = val;
	}
	get showAlternatives(): boolean {
		return this._showAlternatives;
	}
    
    searching = false;
    searchFailed = false;
    
    constructor(private http:HttpClient, private notificationService: NotificationService) {

    }
	
	public ngOnInit() {
		this.RouteInputForm = new FormGroup({
			origin: new FormControl('', {validators: Validators.required}),
			destination: new FormControl('', {validators: Validators.required}),
			varNames: new FormControl('', {validators: Validators.required}),
			includeAlts: new FormControl('')
		})

		this.originRoute = this.RouteInputForm.get('origin').valueChanges
			.pipe(
				debounceTime(300),
				distinctUntilChanged(),
				tap(() => this.searching = true),
				switchMap(term => this.locationSearch(term)
				.pipe(
					tap(() => this.searchFailed = false),
				catchError(() => {
					this.searchFailed = true;
					return of(new LocationModel());
				})
			))
		);

			this.destinationRoute = this.RouteInputForm.get('destination').valueChanges
			.pipe(
				debounceTime(300),
				distinctUntilChanged(),
				tap(() => this.searching = true),
				switchMap(term => this.locationSearch(term)
				.pipe(
					tap(() => this.searchFailed = false),
				catchError(() => {
					this.searchFailed = true;
					return of(new LocationModel());
				})
			))
		);

		this.onChanges();

	}

	protected onChanges(): void {
		
	}

    getRouteEvent() {
		return this.route;
    }

    getDepartTimesEvent() {
		return this.departTimes;
    }
    
    routeClick() {
	if (!this.RouteInputForm.valid) {
	    return;
	}
		this.origin = this.RouteInputForm.value.origin.position.lat + ',' + this.RouteInputForm.value.origin.position.lon;
		this.destination = this.RouteInputForm.value.destination.position.lat + ',' + this.RouteInputForm.value.destination.position.lon;
		this.showAlternatives = this.RouteInputForm.value.includeAlts ? true : false;
		
		Const.VAR_NAMES = this.RouteInputForm.value.varNames.join();

		console.log('var names', Const.VAR_NAMES);
		this.notificationService.updateRoute(
			new DepartureTableModel(this.origin, this.destination, '1553698800', this.showAlternatives)
		);
    }

   public departTimesClick(val?:any): void {
		if (!this.RouteInputForm.valid) {
			return;
		}

		this.origin = this.RouteInputForm.value.origin.position.lat + ',' + this.RouteInputForm.value.origin.position.lon;
		this.destination = this.RouteInputForm.value.destination.position.lat + ',' + this.RouteInputForm.value.destination.position.lon;
		this.showAlternatives = this.RouteInputForm.value.includeAlts ? true : false;

		this.notificationService.updateDepartureTable(
			new DepartureTableModel(this.origin, this.destination, '1553698800', this.showAlternatives)
		);
	}

	public locationSearch(text: string): Observable<LocationModel> {
		
		if (!text) {
		    return of(new LocationModel());
		}
	    
	    let headers = new HttpHeaders();
	    headers = headers.set('Ocp-Apim-Subscription-Key', this.lbsKey);
	    const url = "https://atlas.microsoft.com/search/address/json";

	    let params={
		"api-version":"1",
		"typeahead":"true",
		"query":text,
		"Subscription-Key":this.lbsKey
	    }
	    return this.http.get<any>(url, { params: params, headers: headers })
		.pipe(
			tap((res: LocationModel) => {
				return res.results;
			})
		)
	}

	public displayResults(location: LocationResults): string {
		if (location) {
			return location.address.freeformAddress;
		}
	}
}
