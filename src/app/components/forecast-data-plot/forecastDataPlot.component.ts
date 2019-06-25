import { WindPlot } from './../plots/wind-plot/wind-plot';

import { Component, Input, Output, EventEmitter, OnInit, ViewChildren, QueryList } from '@angular/core';
import { VariableDataPlotComponent } from '../variable-data-plot/variableDataPlot.component';
import { TemperaturePlot } from '../plots/temperature-plot/temperature-plot';
import { PrecipitationPlot } from '../plots/precipitation-plot/precipitation-plot';
import { IrradiancePlot } from '../plots/irradiance-plot/irradiance-plot';
import { CloudCoverPlot } from '../plots/cloud-cover-plot/cloud-cover-plot';
import { SnowDepthPlot } from '../plots/snow-depth-plot/snow-depth-plot';
import { NumericPlot } from '../plots/numeric-plot/numeric-plot';
import { ElevationPlot } from '../plots/elevation-plot/elevation-plot';
import { PotentialRoadStatePlot } from '../plots/potential-road-state_plot/potential-road-state-plot';
import { PotentialDelayRiskPlot } from '../plots/potential-delay-risk-plot/potential-delay-risk-plot';
import { CrosswindPlot } from '../plots/crosswind-plot/crosswind-plot';

@Component({
    selector: 'forecast-data-plot',
    templateUrl: './forecastDataPlot.component.html'
})

export class ForecastDataPlotComponent implements OnInit {

    @Input() forecastData:any;
    @Input() validTimes:any;

    @Output() chartMousemove = new EventEmitter();

    @ViewChildren(VariableDataPlotComponent) varPlots:QueryList<VariableDataPlotComponent>;

    public plotConfigs: Array<any> = [];

    ngOnInit() {
	
    }

	public Refresh() {
		this.plotConfigs = [
			new TemperaturePlot("C", 'Forecast'),
			new PotentialRoadStatePlot(null, ''),
			new PotentialDelayRiskPlot(null, ''),
			new PrecipitationPlot("mm/hr", 'Forecast'),
			new SnowDepthPlot("mm", 'Forecast' ),
			new WindPlot("m/s", 'Forecast'),
			new CrosswindPlot(null, ''),
			// new IrradiancePlot("watt/m^2"),
			// new CloudCoverPlot("%"),
			new ElevationPlot('ft', ''),
			new NumericPlot("Wave Height", {wvhgt:{title:'Wave Height', color:"#00008d"}}, "m", '')
		]

		for (let plot of this.plotConfigs) {
			plot.chartMousemove.subscribe((e) => {
				this.chartMousemove.emit(e);
			});
		}

		this.varPlots.map(x => x.Refresh());
	}
}
