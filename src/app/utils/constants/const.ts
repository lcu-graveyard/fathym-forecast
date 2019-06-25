
export class Const {
    public static LBS_KEY = "4SnPOVldyLX7qlZocZBTSA4TKMq8EQJuURinOs0Wl78";
    public static SERVER_URL: string = 'http://fathymwx.eastus.cloudapp.azure.com';
   // public static SERVER_URL: string = 'https://wxlb01.fathym.com/route';
    // public static SERVER_URL = "http://wxcloud-hrrr.westus.cloudapp.azure.com";
    // public static SERVER_URL = "http://localhost";
    public static FORECAST_IMAGE_DATE_FORMAT = "yyyyMMdd.HHmm";
    public static FORECAST_DISPLAY_DATE_FORMAT = "EEE HH:mm";
    public static FCST_CFG = "hrrr_config";
    // public static VAR_NAMES = "t,sfc_t,prate,ptype,wspd,gust,cloudcover,rad,vis,hgt,snod,wdir";
    public static VAR_NAMES = '';
    public static VAR_NAMES_SELECT: Array<object> = [
                                              {key: 'Temperature', value: 't'},
                                              {key: 'Surface Temp', value: 'sfc_t'},
                                              {key: 'Precipitation', value: 'prate'},
                                              {key: 'Precipitation Type', value: 'ptype'},
                                              {key: 'Wind Speed', value: 'wspd'},
                                              {key: 'Wind Gust', value: 'gust'},
                                              {key: 'Wind Direction', value: 'wdir'},
                                              {key: 'Cloud Cover', value: 'cloudcover'},
                                              {key: 'Radiation', value: 'rad'},
                                              {key: 'Visibility', value: 'vis'},
                                              {key: 'Elevation', value: 'hgt'},
                                              {key: 'Snow Depth', value: 'snod'}]
}
