import { Plot } from "../plots";

export class PotentialDelayRiskPlot extends Plot {
    constructor(public units:string, public subTitle?: string) {
	super("Potential Delay Risk", {
            delay_risk: {
                title:'Potential Delay Risk', 
                color:'#0003dd'
            }
        }, units, subTitle)

        
    }

    getColor(val: number) {
        val = val['Potential Delay Risk'];

        // if (!v) { return '#d8d8d8'; } 
        // if (v > -2 && v <= 1) { return '#00d300'}
        // if (v > 1 && v <= 2) { return '#ffff00'}
        // if (v > 2 && v <= 3 || v > 3) { return '#ff0000'}
        if (val === null) { return '#d8d8d8'; }
        if (val === 0) { return '#ffffff'; } 
        if (val === 1) { return '#00dd00'; } 
        if (val === 2) { return '#b760b7'; } 
        if (val === 3) { return '#0000dd'; }
        if (val === 4) { return '#dd00dd'; } 
        if (val === 5) { return '#008888'; }

        return '#ffff00';
    }
    
    getForceY() {
	    return [0.0, 3];
    }

    getTickCount() {
        return 8;
    }

    /**
     * Assign yAxis label (left side of chart), based off road state value
     * 
     * @param val delay risk value
     */
    getTickFormat(val: number) {
        let v = val;

        if (!v) { return; }
        if (v > -2 && v <= 1) { return 'Slight'; } 
        if (v > 1 && v <= 2) { return 'Moderate'; } 
        if (v > 2 && v <= 3 || v > 3) { return 'Severe'; }

    }
}