import { Plot } from "../plots";

export class PotentialRoadStatePlot extends Plot {
    constructor(public units:string, public subTitle: string) {
	super("Potential Road State", {
            road_state: {
                title:'Potential Road State', 
                color:'#0003dd'
            }
        }, units, subTitle)

        
    }

    getColor(val: number) {
        val = val['Potential Road State']

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
	    return [0.0, 5];
    }

    /**
     * Assign yAxis label (left side of chart), based off road state value
     * 
     * @param val road state value
     */
    getTickFormat(val: number) {

        if (val === 0) { return 'Clear'; } 
        if (val === 1) { return 'Wet'; } 
        if (val === 2) { return 'Mix'; } 
        if (val === 3) { return 'Frozen'; }
        if (val === 4) { return 'Black Ice'; } 
        if (val === 5) { return 'Frost'; }

    }
}