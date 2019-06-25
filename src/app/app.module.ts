import { NotificationService } from './services/notification.service';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmModule, LoadMapService } from '@acaisoft/angular-azure-maps';

import { AppComponent } from './app.component';
import { RouteInputComponent } from './components/route-input/routeInput.component';
import { RouteBuildComponent } from './components/route-builder/routeBuild.component';
import { ForecastDataPlotComponent } from './components/forecast-data-plot/forecastDataPlot.component';
import { VariableDataPlotComponent } from './components/variable-data-plot/variableDataPlot.component';
import { ForecastMapComponent } from './components/map/forecastMap.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { NvD3Module } from 'ng2-nvd3';
import { MatSliderModule, MatSelectModule } from '@angular/material';
import { DisplayDateFormatPipe } from './utils/pipes/timeFormat.pipe';
import { ImageDateFormatPipe } from './utils/pipes/imageTimeFormat.pipe';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DemoMaterialModule} from './material-module';
import { NgxSpinnerModule } from 'ngx-spinner';

import 'd3';
import 'nvd3';
import { DepartureTableComponent } from './components/departure-table/departure-table.component';
import { SharedModule } from './modules/shared/shared.module';
import { WeatherCloudService } from './services/weathercloud.service';

@NgModule({
    imports: [  BrowserModule, 
                FormsModule, 
                AmModule, 
                NgbModule, 
                HttpClientModule, 
                NvD3Module, 
                DemoMaterialModule, 
                NgxSpinnerModule,
                SharedModule,
                BrowserAnimationsModule,
                ReactiveFormsModule,
                MatSelectModule ],
    declarations: [ AppComponent, 
                    RouteInputComponent, 
                    RouteBuildComponent, 
                    ForecastDataPlotComponent, 
                    VariableDataPlotComponent, 
                    ForecastMapComponent, 
                    DisplayDateFormatPipe, 
                    ImageDateFormatPipe, 
                    DepartureTableComponent ],
    bootstrap:    [ AppComponent ],
    providers:    [ LoadMapService, 
                    WeatherCloudService,
                    NotificationService,
                    DisplayDateFormatPipe, 
                    ImageDateFormatPipe ]
})
export class AppModule { }
