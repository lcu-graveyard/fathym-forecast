import { Plot } from '../plots';

export class ElevationPlot extends Plot {
    constructor(public units: string, subTitle: string) {
      super('Elevation', {
          hgt: {
            title: 'Elevation',
            color: '#000'
          }
        }, units, subTitle);
      }

      /**
       * Set gradient background colors of plots(charts)
       *
       * @param val elevation value
       */
      getColor(val: number) {
        val = val['Elevation'];

        // if (val) { 
        //     return this.elevation(val); 
        // }

        return '#fff';
      }

      // protected elevation(val: number): string {
    
        // const belowSeaLevel: boolean = val < 0;
        // const seaLevel: boolean = val === 0;
        // const low: boolean = val > 0 && val <= 2000;
        // const lowMed: boolean = val > 2000 && val <= 3000;
        // const med: boolean = val > 3000 && val <= 4000;
        // const medHigh: boolean = val > 4000 && val <= 5000;
        // const high: boolean = val > 5000 && val <= 6000;
        // const highExt: boolean = val > 6000 && val <= 7000;
        // const extraHigh: boolean = val > 7000 && val <= 8000;
        // const topOfTheWorld: boolean = val > 8000;

        // if (belowSeaLevel) { return '#512c00'; }
        // if (seaLevel) { return '#e07b00'; }
        // if (low) { return '#d8e000'; }
        // if (lowMed) { return '#95e000'; }
        // if (med) { return '#38e000'; }
        // if (medHigh) { return '#00e099'; }
        // if (high) { return '#008ae0'; }
        // if (highExt) { return '#6100e0'; }
        // if (extraHigh) { return '#e000ab'; }
        // if (topOfTheWorld) { return '#e00030'; }
		
	// }
}

