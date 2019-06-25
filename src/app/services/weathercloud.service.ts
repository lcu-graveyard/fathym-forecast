import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { WeatherCloudModel } from '../models/departure-table/weather-cloud.model';
import { HttpUrlEncoder } from '../utils/http/http-url-encoder.utils';

@Injectable()
export class WeatherCloudService {

  protected apiRoot: string;

  constructor(private httpClient: HttpClient) {
    this.apiRoot = 'https://wxlb01.fathym.com';
  }


  public DepartureTableData(apiKey: string, 
                            origin: string, 
                            destination: string, 
                            departureTime: string,
                            includeAlts: boolean): Observable<any[]> {

    if (!apiKey) {
      console.warn('You need to set an API Key');
      return;
    }

    let params = new HttpParams();

    params = params.append('origin', origin);
    params = params.append('destination', destination);
    params = params.append('departureTime', departureTime);
    params = params.append('includeAlts', String(includeAlts));
    params = params.append('token', apiKey);

    return this.httpClient.get<any[]>(`${this.apiRoot}/departtimes`, {params: params})

   .pipe(
      map((res) => {
        const data = this.remapData(res);
        return data;
      })
   );
  }

  /**
   * API call when creating polygon shape regions on the map
   *
   * @param points array of lat/long values that represent each point of the shape
   */
  public ShapeRegion(points: Array<Array<number>>): any {

    const url: string = 'http://fathymwx.eastus.cloudapp.azure.com/fcst/fcstpoly';
    let pointArr: Array<string> = [];
    let pointStr: string = '';

    pointArr = points.map((item: Array<number>) => {
      // lat / long values come in backwards, so they need to be reveresed
      return '[' + item.reverse() + ']';
    });

    pointStr = pointArr.toString();

    let httpParams = new HttpParams({
     encoder: new HttpUrlEncoder()
    });

    httpParams = httpParams.append('latlons', '[' + pointStr + ']');
    httpParams = httpParams.append('method', 'avg');

    return this.httpClient.get<any>(url, { params: httpParams }).pipe(
      map(res => {
        console.log(res);
        return res;
      })
    );
  }

  private handleError(err: any): any {
    console.log('error');
  }

  /**
   * Remap the data being returned so it fits with format we expect
   * @param val Date being returned from API
   */
  private remapData(val: any): Array<WeatherCloudModel> {
    const arr: Array<WeatherCloudModel> = [];
    const element = val['data'][0];
      Object.keys(element).forEach((key, index) => {
        const item = {} as WeatherCloudModel;
        Object.keys(element[key]).forEach((childKey, childIndex) => {
          switch (childKey.toUpperCase()) {
            case 'GUST':
            item.windGustMin = element[key][childKey][0];
            item.windGustMax = element[key][childKey][1];
            break;
            case 'PRECIP':
            item.precipMin = element[key][childKey][0];
            item.precipMax = element[key][childKey][1];
            break;
            case 'PTYPE':
            item.ptypeMin = element[key][childKey][0];
            item.ptypeMax = element[key][childKey][1];
            break;
            case 'SPD':
            item.windSpdMin = element[key][childKey][0];
            item.windSpdMax = element[key][childKey][1];
            break;
            case 'TEMP':
            item.tempMin = element[key][childKey][0];
            item.tempMax = element[key][childKey][1];
            break;
            case 'VTIMES':
            item.vtimesStart = element[key][childKey][0];
            item.vtimesEnd = element[key][childKey][1];
            break;
          }
        });
        arr.push(item);
      });
    return [...arr];
  }
}
