
import { Const } from '../constants/const';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'displayDateFormat'
})

export class DisplayDateFormatPipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return super.transform(value, Const.FORECAST_DISPLAY_DATE_FORMAT);
  }
}
