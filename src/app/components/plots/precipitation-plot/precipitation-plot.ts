import { Plot } from "../plots";

export class PrecipitationPlot extends Plot {
    constructor(public units:string, public subTitle: string) {
	super("Precipitation", {
	    prate:{
			title:'Precipitation Rate',
			color:'#0000dd'
		}, 
		ptype:{
			title:'ptype'
	    }}, units, subTitle)
    }
    getForceY() {
	return [0.0, 0.05];
    }

    getColor(v: number) {
		let ptype = v['ptype'];
		let precip = v['Precipitation Rate'];

		if (precip === null) {
			return '#d8d8d8';
		}

		if (ptype === 0) {
			return "#ffffff";
		} else if (ptype === 1) {
			if (precip > 0 && precip < 0.5) {
			return "#00dd00";
			} else if (precip >= 0.5 && precip < 0.75) {
			return "#ffff00";
			} else if (precip >= 0.75) {
			return "#ff0000";
			}
		} else if (ptype === 2) {
			return "#b760b7";
		} else if (ptype >= 3) {
			return "#0000dd";
		}
		return '#888888';
    }

}