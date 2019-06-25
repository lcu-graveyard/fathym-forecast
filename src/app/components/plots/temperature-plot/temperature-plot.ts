import { Plot } from "../plots";

export class TemperaturePlot extends Plot {
    constructor(public units:string, public subTitle: string) {
			super("Temperature", {
					t:{
						title:'Air Temp',
						color:'#0000dd'
					},
					sfc_t:{
						title:'Surface Temp',
						color:'#dd00b4'
					},
					road_temp:{
						title:'Road Surface Temp',
						color:'#222222'
					}/*,dewpt:{
						title:'Dew Point Temperature',
						color:'#006400'
					}*/}, units, subTitle)
				}

				/**
				 * Set chart background color, based off current value
				 * 
				 * @param val temperature value
				 */
				getColor(val: number) {
					val = val['Air Temp'] || val['Surface Temp'] || val['Road Surface Temp'];

					if (val === null) { return '#0000dd'; }
					if (val <= 32) { return '#0059d6'; } 
					if (val > 32 && val <= 85) { return '#00dd00'; } 
					if (val > 85 && val <= 95) { return '#ffff00'; } 
					if (val > 95) { return '#ff0000'; }			

					return '#fff';
				}
}