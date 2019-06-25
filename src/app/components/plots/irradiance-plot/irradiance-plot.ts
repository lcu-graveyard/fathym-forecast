import { Plot } from "../plots";

export class IrradiancePlot extends Plot {
    constructor(public units:string, public subTitle: string) {
	super("Irradiance", {rad: { title:'Shortwave Radiation', color:'#0000dd'}}, units, subTitle)
    }

    getColor(v) {
	let t = v['Shortwave Radiation']
	if (t == null) {
	    return '#d8d8d8';
	}

	let c = (t / 950.0) * 100;
	
	if (c > 100) {
	    c = 100;
	}
	let color = this.findColorBetween('#ffffff', '#FDB813', c)
	return color;	
    }
    
    getForceY() {
	return [0.0, 250];
    }
}