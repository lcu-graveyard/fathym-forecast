import { FathymForecastModel } from '../../models/departure-table/fathym-forecast.model';

export class FathymForecastConditionIcons {

  constructor(data: FathymForecastModel, colType: string) {
    switch(colType.toUpperCase()) {
      case 'TEMPMIN':
        return FathymForecastConditionIcons.temperature(data.tempMin);
        break;
      case 'TEMPMAX':
        return FathymForecastConditionIcons.temperature(data.tempMax);
        break;
      case 'PRECIPMAX': //**** precipMax does not correlate to percentage of chance ****
        return FathymForecastConditionIcons.precipitationType(data);
        break;
      case 'WINDSPDMAX':
        return FathymForecastConditionIcons.windSpeed(data.windSpdMax);
        break;
      case 'WINDGUSTMAX':
        return FathymForecastConditionIcons.windGust(data.windGustMax);
        break;
    }
    
  }

  private static precipitationType(data: FathymForecastModel): string {
    let icon: string = '';
    switch (data.ptypeMax) {
      case 0: // not concerned with ptypeMax of zero
        icon = 'icon-no_value ff-icon-none';
        // data.precipMax = 0; 
      break;
      case 1:
        icon = FathymForecastConditionIcons.rainType(data.precipMax);
        break;
      case 2:
        icon = FathymForecastConditionIcons.mixedType(data.precipMax);
        break;
      case 3:
        icon = FathymForecastConditionIcons.snowType(data.precipMax);
        break;
    }
    
   return icon;
  }

  private static isBetween(val: number, start: number, end: number ): boolean {
    return (start < end ? val >= start && val <= end : val >= end && val <= start);
  }

  private static rainType(precipMax: number):  string {
    
    const none: boolean = precipMax < 0.000000001;
    const light: boolean = this.isBetween(precipMax, 0.000000001, 0.05);
    const med: boolean = this.isBetween(precipMax, 0.05, 0.2125);
    const heavy: boolean = this.isBetween(precipMax, 0.2125, 0.375);
    const extreme: boolean = precipMax > 0.375;

    if (none) { return 'icon-no_value ff-icon-none'; }
    if (light) { return 'icon-rain_light temperature-ok'; }
    if (med) { return 'icon-rain_medium temperature-warn'; }
    if (heavy) { return 'icon-rain_heavy temperature-alert'; }
    if (extreme) {  return 'icon-rain_extreme temperature-alert'; }
  }

  private static mixedType(precipMax: number): string {

    const none: boolean = precipMax < 0.000000001;
    const light: boolean = this.isBetween(precipMax, 0.000000001, 0.05);
    const med: boolean = this.isBetween(precipMax, 0.05, 0.1125);
    const heavy: boolean = this.isBetween(precipMax, 0.1125, 0.275);
    const extreme: boolean = precipMax > 0.275;

    if (none) { return 'icon-no_value ff-icon-none'; }
    if (light) { return 'icon-rain_snow_mixed_light temperature-ok'; }
    if (med) { return 'icon-rain_snow_mixed_medium temperature-warn'; }
    if (heavy) { return 'icon-rain_snow_mixed_heavy temperature-alert'; }
    if (extreme) { return 'icon-rain_snow_mixed_extreme temperature-alert'; }
  }

  private static snowType(precipMax: number): string {
 
    const none: boolean = precipMax < 0.000000001;
    const light: boolean = this.isBetween(precipMax, 0.000000001, 0.05);
    const med: boolean = this.isBetween(precipMax, 0.05, 0.08);
    const heavy: boolean = this.isBetween(precipMax, 0.08, 0.13);
    const extreme: boolean = precipMax > 0.13;

    if (none) { return 'icon-no_value ff-icon-none'; }
    if (light) { return 'icon-snow_light temperature-ok'; }
    if (med) { return 'icon-snow_medium temperature-warn'; }
    if (heavy) { return 'icon-snow_heavy temperature-alert'; }
    if (extreme) { return 'icon-snow_extreme temperature-alert'; }
  }

  private static windSpeed(windSpdMax: number): string {
    const none: boolean = windSpdMax === 0;
    const light: boolean = windSpdMax < 20;
    const med: boolean = windSpdMax >= 20 && windSpdMax <= 29;
    const heavy: boolean = windSpdMax > 29 && windSpdMax < 40;
    const extreme: boolean = windSpdMax >= 40;

    if (none) { return 'icon-no_value ff-icon-none'; }
    if (light) { return 'icon-wind_light temperature-ok'; }
    if (med) { return 'icon-wind_medium temperature-warn'; }
    if (heavy) { return 'icon-wind_heavy temperature-alert'; }
    if (extreme) { return 'icon-wind_extreme temperature-alert'; }
  }

  private static windGust(windGustMax: number): string {
    const none: boolean = windGustMax === 0;
    const light: boolean = windGustMax < 20;
    const med: boolean = windGustMax >= 20 && windGustMax <= 29;
    const heavy: boolean = windGustMax > 29;
    const extreme: boolean = windGustMax >= 40;

    if (none) { return 'icon-no_value ff-icon-none'; }
    if (light) { return 'icon-wind_light temperature-ok'; }
    if (med) { return 'icon-wind_medium temperature-warn'; }
    if (heavy) { return 'icon-wind_heavy temperature-alert'; }
    if (extreme) { return 'icon-wind_extreme temperature-alert'; }
  }

  private static temperature(temp: number): string {
    const freezing: boolean = temp <= 32;
    const cold: boolean = temp <= 32;
    const ok: boolean = temp > 32 && temp < 85;
    const warm: boolean = temp >= 85 && temp < 95;
    const alert: boolean = temp > 95;

    if (freezing) { return 'icon-temperature_freezing temperature-freezing'; }
    if (cold) { return 'icon-temperature_freezing temperature-freezing'; }
    if (ok) { return 'icon-temperature_warm temperature-warn'; }
    if (warm) {  return 'icon-temperature_warm temperature-warn'; }
    if (alert) { return 'icon-temperature_hot temperature-alert'; }
  }
}
