
import { Const } from '../constants/const';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'imageDateFormat'
})
export class ImageDateFormatPipe extends DatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
	return super.transform(value, Const.FORECAST_IMAGE_DATE_FORMAT, "UTC");
    }
}
