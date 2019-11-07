
import { Component, ViewChild, ViewChildren, QueryList, OnInit, OnDestroy } from '@angular/core';

import { RouteInputComponent } from './components/route-input/routeInput.component';
import { RouteBuildComponent } from './components/route-builder/routeBuild.component';
import { ForecastDataPlotComponent } from './components/forecast-data-plot/forecastDataPlot.component';
import { ForecastMapComponent } from './components/map/forecastMap.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataGridConfig } from './config/departure-table/data-grid.config';
import { DataGridFeatures } from './config/departure-table/data-grid-features.config';
import { DataGridPagination } from './config/departure-table/data-grid-pagination.config';
import { ColumnDefinition } from './config/departure-table/column-def.config';
import { PipeConstants } from './utils/constants/pipe.constants';
import { FathymForecastModel } from './models/departure-table/fathym-forecast.model';
import { FathymForecastService } from './services/fathymforecast.service';
import { FathymForecastConditionIcons } from './utils/fathym-forecast/fathym-forecast-conditions-icons.util';
import { Subscription } from 'rxjs/internal/Subscription';
import { NotificationService } from './services/notification.service';
import { DepartureTableModel } from './models/departure-table/departure-table-config.model';
import { map, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { Const } from './utils/constants/const';
import { FFDatasourceTypesModel } from './models/ff-datasource-types.model';

declare const require;

@Component({
  selector: 'route-fcst-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})

export class AppComponent implements OnInit, OnDestroy  {

	public gridParameters: DataGridConfig;
	protected columnDefs: Array<ColumnDefinition> = [];
	protected apiKey: string = '';
	protected departureTableSubsscription: Subscription;
	protected routeChangeSubscription: Subscription;
	protected PolygonShapeChangeSubscription: Subscription;

    name = 'FathymForecast Route Forecast';
	lbsKey = Const.LBS_KEY;
	
    @ViewChild('routeInput') routeInput:RouteInputComponent;
    @ViewChild('routeBuild') routeBuild:RouteBuildComponent;
    @ViewChild(ForecastDataPlotComponent) plot:ForecastDataPlotComponent;
    @ViewChild(ForecastMapComponent) fcstMap:ForecastMapComponent;

    fcstData;
    validTimes;
    points;
    dataSource;
	dataSources = {};
	
    constructor(
		private http:HttpClient, 
		private spinner: NgxSpinnerService,
		private notificationService: NotificationService,
		private fathymForecastService: FathymForecastService) {

		this.loadDataSources();
    }

	ngOnDestroy() {
		this.departureTableSubsscription.unsubscribe();
		this.PolygonShapeChangeSubscription.unsubscribe();
		this.routeChangeSubscription.unsubscribe();
	}

    ngOnInit() {

		/**
		 * listener for when departure table needs updated
		 */
		this.departureTableSubsscription = this.notificationService.departureTableChanged.subscribe(
			(params: DepartureTableModel) => {
				this.setGridParameters(params);
			}
		)

		this.routeChangeSubscription = this.notificationService.routeChanged.subscribe(
			(params: DepartureTableModel) => {
				this.routeEvent(params);

				this.fcstMap.mapClick.subscribe((e) => {
					let lon = e[0];
					let lat = e[1];
					if (this.routeBuild) {
					this.routeBuild.addPoint(lat, lon, 5);
					}
				});
			
				this.plot.chartMousemove.subscribe((e) => {
					this.fcstMap.setCurrentMarker(e.index);
					this.fcstMap.setTimeFromChart(e.value);
				});
			}
		)

		this.PolygonShapeChangeSubscription = this.notificationService.PolygonShapeChanged.subscribe(
			(params: any) => {

				if (Object.keys(params['data'][0]).length < 1) { console.error('PolygonShapeChangeSubscription - No data returned'); return; }

				this.handlePolygonResponse(params);
			}
		)

	// this.loadDataSources();
    }

    ngAfterViewInit() {
	// this.routeInput.getRouteEvent().subscribe(() => this.routeEvent());
	//this.routeInput.getDepartTimesEvent().subscribe(() => this.departTimesEvent());
	
	this.routeBuild.route.subscribe(() => this.routeBuildEvent());
	//this.routeBuild.getDepartTimesEvent().subscribe(() => this.departTimesEvent());
    }

    tabChanged(e) {
    }
    
    selectDataSource(dataSource) {
		this.dataSource = dataSource;
    }

    loadDataSources() {
	//should fetch these from server in the future
	this.dataSources = [{
	    name:'HRRR',
	    urlPrefix:'/fcst',
	    fcstCfg:'hrrr_config',
	    host:Const.SERVER_URL,
	    varNames:Const.VAR_NAMES
	},{
	    name:'GFS',
	    urlPrefix:'/fcst',
	    fcstCfg:'gfs_config',
	    host:Const.SERVER_URL,
	    varNames:Const.VAR_NAMES
	},{
	    name:'Blend',
	    urlPrefix:'/blend',
	    fcstCfg:null,
	    host:Const.SERVER_URL,
	    varNames:Const.VAR_NAMES
	},{
	    name:'MWAVE',
	    urlPrefix:'/fcst',
	    fcstCfg:'mwave_config',
	    host:'http://localhost',
	    varNames:null
	}];
	const test: FFDatasourceTypesModel = new FFDatasourceTypesModel(this.dataSources[2]);
	this.selectDataSource(this.dataSources[2]);
    }

	/**
	 * Handle the response from a polygon shape search
	 * 
	 * @param response returned data
	 */
	protected handlePolygonResponse(response: any): void {
		let data = response['data'][0];
		this.fcstData = data;
		this.validTimes = response['valid_times'];
		this.plot.Refresh();
	}

	/**
	 * Handle the response from a route search
	 * 
	 * @param response returned data
	 */
    protected handleRouteResponse(response: any): void {
		console.log('handleRouteResponse', response);
		
		if (!response || response.length === 0 || response['data'].length === 0) {
			return;
		}

		let data = response['data'][0]['data']; // if include alts is true, this will return multiple routes, just looking at the first for now
		this.fcstData = data;
		this.validTimes = response['data'][0]['valid_times'];
		this.plot.Refresh();
		this.points = this.decode(response['data'][0]['points']);
		this.fcstMap.displayRoute(this.points);
    }

    public doRoute(url, params): void {

	if (this.dataSource.fcstCfg) {
	    params = params.set('fcst_cfg', this.dataSource.fcstCfg)
	}

	// if (this.dataSource.varNames) {
	   // params = params.set('var_names', this.dataSource.varNames);
	   params = params.set('var_names', Const.VAR_NAMES);
	// }

	this.spinner.show();

	console.log('params', params);
	this.http.get(url, {params: params})
	.pipe(
        map(res => res),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        }),
        catchError(err => {
			console.log('caught rethrown error, providing fallback value');
            return of([]);
        })
    )
    .subscribe(
        res => {
			console.log('HTTP response', res);
			this.handleRouteResponse(res);
		},
        err => console.log('HTTP Error', err),
        () => {
			console.log('HTTP request completed.');
			this.spinner.hide();
		}
    );

	// this.http.get(url, {params: params}).subscribe(response => {
	// 	this.spinner.hide()
	// 	console.log('route url', url);
	//     this.handleRouteResponse(response);
	// }, error => {
	//     this.spinner.hide()
	//     console.log(error)
	// });

	// this.http.get(url, {params: params})
	// .pipe(
	// 	map((res) => {
	// 		this.spinner.hide()
	// 		console.log('route url', url);
	// 		this.handleRouteResponse(res);
	// 	}),
	// 	catchError(err => {
	// 		console.log('Handling error locally and rethrowing it...', err)
	// 		return throwError(err);
	// 	})
	//  );

	// .subscribe(response => {
	// 	this.spinner.hide()
	// 	console.log('route url', url);
	//     this.handleRouteResponse(response);
	// }, error => {
	//     this.spinner.hide()
	//     console.log(error)
	// });
    }


    routeBuildEvent() {
	let url = this.dataSource.host + this.dataSource.urlPrefix + '/routepts';
	// let url = this.dataSource.host + '/fcst/routepts';
	let route = this.routeBuild.getRoutePoints();
	console.log(route.latlons, route.valid_times);

	let params = new HttpParams()
	    .set('latlons', JSON.stringify(route.latlons))
	    .set('valid_times', JSON.stringify(route.valid_times));
	this.doRoute(url, params);
    }
	
	
    routeEvent(routeParams: DepartureTableModel) {
	let url = this.dataSource.host + this.dataSource.urlPrefix + '/routefcst';
	// let url = this.dataSource.host;
	let incAlts = String(this.routeInput.showAlternatives);

	let params = new HttpParams()
	
	    .set('origin', routeParams.origin)
		.set('destination', routeParams.destination)
		.set('departureTime', routeParams.departureTime)
		.set('includeAlts', String(routeParams.includeAltRoutes))
		.set('token', 'fathym') // added for testing - Shannon
	this.doRoute(url, params);
    }

    departTimesEvent() {
	console.log('depart times event');
    }


    decode(encoded) {
        var points = [];
	var index = 0, len = encoded.length;
        var lat = 0, lng = 0;
        while (index < len) {
            var b, shift = 0, result = 0;
            do {
                b = encoded.charAt(index++).charCodeAt(0) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lat += dlat;
            shift = 0;
            result = 0;
            do {
                b = encoded.charAt(index++).charCodeAt(0) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lng += dlng;
            var llat = ( lat / 1E5);
            var llon = ( lng / 1E5);
            var pos = new atlas.data.Position(llon,llat);
            points.push(pos);
        }
        return points;
	}
	
	/**
   * This sets up the grid parameters (columns and data, and features)
   */
  private setGridParameters(params: DepartureTableModel): void {

	this.apiKey = 'fathym';

	this.columnDefs = [
	 new ColumnDefinition(
		 'vtimesStart', 
		 '', 
		 true, 
		 false, 
		 false, 
		 PipeConstants.PIPE_EPOCH
		 ),
	 new ColumnDefinition(
		 'tempMin', 
		 'Temp Min', 
		 true, 
		 true, 
		 false, 
		 PipeConstants.PIPE_TEMP_FAHRENHEIT, 
		 FathymForecastConditionIcons
		 ),
	 new ColumnDefinition(
		 'tempMax', 
		 'Temp Max', 
		 true, 
		 true, 
		 false, 
		 PipeConstants.PIPE_TEMP_FAHRENHEIT, 
		 FathymForecastConditionIcons
		 ),
	 new ColumnDefinition(
		 'precipMax', 
		 'Precipitation', 
		 false, 
		 true, 
		 false, 
		 null, 
		 FathymForecastConditionIcons
		 ),
	 new ColumnDefinition(
		 'windSpdMax', 
		 'Wind Speed', 
		 true, 
		 true, 
		 false, 
		 PipeConstants.PIPE_MPH, 
		 FathymForecastConditionIcons
		 ),
	 new ColumnDefinition(
		 'windGustMax', 
		 'Wind Gust', 
		 true, 
		 true, 
		 false, 
		 PipeConstants.PIPE_MPH, 
		 FathymForecastConditionIcons
		 )
	 ];

	//  const paginationDetails: DataGridPagination = new DataGridPagination();
	//  paginationDetails.pageSize = 10;
	//  paginationDetails.pageSizeOptions = [1, 5, 10, 20, 30];

	 const features: DataGridFeatures = new DataGridFeatures();
	 // features.paginator = paginationDetails;
	 features.filter = true;

	this.gridParameters = new DataGridConfig(
		this.fathymForecastService.DepartureTableData(this.apiKey, params.origin, params.destination, params.departureTime, params.includeAltRoutes), this.columnDefs, features);
   }
}
