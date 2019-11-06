import { PolygonDrawingTool } from '../../utils/weather-cloud/map/polygon-drawing-tool.utils';

import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { LoadMapService, AtlasMapComponent } from "@acaisoft/angular-azure-maps";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { Const } from '../../utils/constants/const';
import { DisplayDateFormatPipe } from '../../utils/pipes/timeFormat.pipe';
import { ImageDateFormatPipe } from '../../utils/pipes/imageTimeFormat.pipe';
import { MatSlider } from '@angular/material';
import { FathymForecastService } from '../../services/fathymforecast.service';
import { throwError } from 'rxjs/internal/observable/throwError';
import { of } from 'rxjs/internal/observable/of';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'forecast-map',
    templateUrl: './forecastMap.component.html',
    styleUrls:['./forecastMap.component.css']
})

export class ForecastMapComponent implements OnInit {

    
    @Input() lbsKey:string;

    @Output() mapClick = new EventEmitter();

    @ViewChild('maper') maper: AtlasMapComponent;
    @ViewChild('imageSlider') slider: MatSlider;

    public config;

    public IsLoading: boolean;

    imageVarNames = [];
    imageValidTimes = [];
    selectedValidTime = "";
    selectedVarName = null;
    startMarker = null;
    endMarker = null;
    currentMarker = null;

    route = null;

    imageLayer = null;

    protected polygonDrawingTool: PolygonDrawingTool;

    protected mapClickedArray: Array<Array<number>> = [];
    

    constructor (
        public http:HttpClient, 
        public mapService: LoadMapService, 
        private displayDatePipe:DisplayDateFormatPipe, 
        private imageDatePipe:ImageDateFormatPipe,
        private fathymForecastService: FathymForecastService,
        private notificationService: NotificationService) {
    }

    ngOnInit() {
	this.config = {
	    'subscription-key': this.lbsKey,
	    'interactive':true,
	    'zoom':5,
	    'center':[-102.1, 39.5]
	};
	this.mapService.load().toPromise().then(() => {
	})
	this.slider.input.subscribe(() => {
	    let value = this.slider.value;
	    this.setSliderTime(value);
	});
    }

    public onMapClick(latLongArr: Array<number>): void {
        this.mapClickedArray.push(latLongArr);
	    this.mapClick.emit(latLongArr);
    }

    public onMapLoaded() {
        // let url = Const.SERVER_URL + "/blend/routefcst";
        // // let url = Const.SERVER_URL;
        // this.http.get(url).subscribe(response => {
        //     this.imageVarNames = response["var_names"];
        //     this.imageValidTimes = response["valid_times"];
        //     this.setSliderTime(0);
        // });
    }
    
    public CreatePolygonShape(): void {
        this.polygonDrawingTool = new PolygonDrawingTool(this.maper, 'null', (param) => {
            this.shapeRegionCallback(param);
        });

        this.polygonDrawingTool.StartDrawing();
    }

    public ClearPolygonShape(): void {
        this.polygonDrawingTool.Clear();
    }

 /**
   *
   * @param data array of points returned from the drawn polygon
   */
  protected shapeRegionCallback(data: Array<Array<number>>): void {
    this.IsLoading = true;

    this.fathymForecastService.ShapeRegion(data)
    .pipe(
        map(res => res),
            catchError(err => {
                this.IsLoading = false;
                console.log('shape region error', err);
                return throwError(err);
            }),
            catchError(err => {
                console.log('shape region error, providing fallback value');
            return of([]);
        })
    )
    .subscribe(
    res => {
        console.log('ShapeRegionCallback', res);
        this.notificationService.UpdatePolygonShape(res);
    },
        err => console.log('HTTP Error', err),
        () => {
        console.log('HTTP request completed.');
        this.IsLoading = false;
    });
  }

    protected polygonShapeCallBack(activeShapeArray: Array<Array<number>>): void {
        console.log('activeShapeArray', activeShapeArray);
        // let selectedPins: Array<any> = [];

        // //Search for all points that intersect the polygon.
        // for (var i = 0; i < pins.length; i++) {
        //     var intersection = turf.intersect(polygonShape.toJson(), pins[i]);
        //     if (intersection) {
        //         selectedPins.push(pins[i]);
        //     }
        // }
        // //Do something with the selected pins.
        // //For demo purposes, we will simply output the name of each pin.
        // var html = [selectedPins.length, ' Pins Selected:<br/><br/>'];
        // for (var i = 0; i < selectedPins.length; i++) {
        //     html.push(selectedPins[i].properties.name, '<br/>');
        // }
        // //TODO: consider updating code to change icon of selected pins.
        // document.getElementById('output').innerHTML = html.join('');
    }

    setCurrentMarker(index) {
        this.maper.map.removeLayers(['currentMark']);
        let point = this.route[index];
        this.currentMarker = new atlas.data.Feature(new atlas.data.Point(point));
        this.maper.map.addPins([this.currentMarker], {
                name:"currentMark"
            });
    }

    displayRoute(points:any) {
        this.maper.map.removeLayers(['routeLine','routeStart','routeEnd']);
        let decodedPath = points;
        var min_lat = 9999;
        var min_lon = 9999;
        var max_lat = -9999;
        var max_lon = -9999;

        for (var j = 0; j < decodedPath.length; j++) {
            var llat = decodedPath[j][1];
            var llon = decodedPath[j][0];
            if (llat < min_lat) min_lat = llat;
            if (llat > max_lat) max_lat = llat;
            if (llon < min_lon) min_lon = llon;
            if (llon > max_lon) max_lon = llon;
        }

	    var nn = decodedPath.length;
        var start = decodedPath[0];
        var end = decodedPath[nn-1];
        this.startMarker = new atlas.data.Feature(new atlas.data.Point(start));
	    this.maper.map.addPins([this.startMarker], {
            name:"routeStart"
        });
        this.endMarker = new atlas.data.Feature(new atlas.data.Point(end));
        this.maper.map.addPins([this.endMarker], {
	    name:"routeEnd"
        });

        var line = new atlas.data.LineString(points);
        var fline = new atlas.data.Feature(line);
        this.maper.map.addLinestrings([fline], {
                    name:'routeLine',
                    width:4,
                    color:"#0000CD"
        });

        var sw = new atlas.data.Position(min_lon - 0.75, min_lat - 0.75);
            var ne = new atlas.data.Position(max_lon + 0.75, max_lat + 0.75);
            var bbox = new atlas.data.BoundingBox(sw, ne);
            this.maper.map.setCameraBounds({
                bounds:bbox
            });
        this.route = points;
    }
    
    setTimeFromChart(vtime) {
        var cl = this.closest(this.imageValidTimes, vtime);
        var i = cl[1];
        this.slider.value = i;
        this.setSliderTime(i);
    }
    
    setSliderTime(value) {
        if (value == null || this.imageValidTimes.length <= value) {
            return;
        }
        let validTime = this.imageValidTimes[value];
        if (!validTime) {
            return;
        }
        let dateTime = new Date(validTime*1000);
        let dateStr = this.displayDatePipe.transform(dateTime);
        this.selectedValidTime = dateStr;

        if (this.selectedVarName) {
            let imageTimeStr = this.imageDatePipe.transform(dateTime);
            let url = Const.SERVER_URL + "/blend/tiled/" + this.selectedVarName + "/" + imageTimeStr + "/{x}/{y}/{z}";
            this.imageLayer = this.maper.map.layers.add(new atlas.layer.TileLayer({
            tileUrl:url,
            opacity: 0.7,
            tileSize:256
            },'wximage'));
        }
    }

    closest(arr, closestTo){
        var closest = Math.max.apply(null, arr); //Get the highest number in arr in case it match nothing.
        var ci = -1;
	for(var i = 0; i < arr.length; i++){ //Loop the array
            if(arr[i] >= closestTo && arr[i] < closest) {
	        closest = arr[i]; //Check if it's higher than your number, but lower than your closest value
                ci = i;
            }
        }
        return [closest,ci]; // return the value
    }

    selectImage(varName:any) {
        this.selectedVarName = varName;
        this.setSliderTime(this.slider.value);
    }
    
}
