import { Plot } from "../plots";

export class CloudCoverPlot extends Plot {
    constructor(public units:string, subTitle: string) {
		super("Cloud Cover", {cloudcover:{title:'Cloud Cover', color:'#222222'}}, units, subTitle)
    }

    public getColor(v) {
		let c = v['Cloud Cover']
		if (c == null) {
			return '#d8d8d8';
		}
		let color = this.findColorBetween('#ffffff', '#d8d8d8', c)
		return color;
		}
		
		getForceY() {
		return [0.0, 100];
    }

}