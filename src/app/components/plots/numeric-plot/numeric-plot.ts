import { Plot } from "../plots";

export class NumericPlot extends Plot {
    constructor(public title:string, public config:object, public units:string, public subTitle: string) {
	super(title, config, units, subTitle);
    }

    getForceY() {
	return [0.0, 5];
    }
}