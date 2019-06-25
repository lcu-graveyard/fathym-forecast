
import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';

import { Plot } from '../plots/plots';

declare let d3: any;

@Component({
    selector: 'variable-data-plot',
    templateUrl: './variableDataPlot.component.html',

    styleUrls: [
	'../../../../node_modules/nvd3/build/nv.d3.css',
	'../plots/plots.css'
    ],
    encapsulation: ViewEncapsulation.None
})

export class VariableDataPlotComponent implements OnInit {
    @Input() forecastData:any;
    @Input() validTimes:any;
    @Input() plot:Plot;
    
    @ViewChild('d3plot') d3plot : any;


    options;
    chartData;

    gradientId = 0;

    ngOnInit() {
        this.plot.setD3Plot(this.d3plot);
        this.Refresh();
    }

    clear() {
        this.options = null;
        this.chartData = null;
    }
    
    public Refresh() {
        this.plot.loadChartData(this.forecastData, this.validTimes);
        this.options = this.plot.getOptions();
        this.chartData = this.plot.getChartData();
    }
}
