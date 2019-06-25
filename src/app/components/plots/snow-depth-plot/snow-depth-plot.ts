import { Plot } from "../plots";

export class SnowDepthPlot extends Plot {
    constructor(public units:string, public subTitle: string) {
	super("Snow Depth", {
		snod: {
			title:'Snow Depth', 
			color:'#0000dd'
		},
		d_snod: {
			title: 'Cumulative', 
			color: '#222222'
		}
	}, units, subTitle)
    }

		/**
     * Set chart background color, based off current value
     * 
     * @param val snow depth value
     */
    getColor(val: number) {
			val = val['Snow Depth'];

			if (val === null) { return "#d8d8d8"; }
			
			if (val === 1) { return "#00dd00"; }
			if (val === 2) { return "#b760b7"; }
			if (val >= 3) { return '#0000dd';}
			
			return "#ffffff";
    }
    
    getForceY() {
		return [0.0, 5];
    }
}