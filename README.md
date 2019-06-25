## WeatherCloud UI Componenets

This project provides Angular 2+ components that interface with the Weather Cloud forecast backend.

### Configure

Check the azure maps subscription key and server url are correct in src/app/const.ts, run the dev server with ng serve.

### Route Input Component

Provides auto-complete origin/destination/includeAlts controls:

| param | in/out | description | example |
| --- | --- | --- | --- |
| lbsKey | Input | Azure maps subscription key (previously named LBS) | ``` <route-input lbsKey="..."></route-input>  ```|
| route | Output | Route button click event, parameters have been verified valid | routeInput.getRouteEvent().subscribe(() => ...) |
| departTimes | Output | Depart times button click event, parameters have been verified valid | routeInput.getDepartTimesEvent().subscribe(() => ...) |


### Forecast Data Plot Component

Provides vertical list of charts given a forecast data response from weathercloud backend:

| param | in/out | description | example |
| --- | --- | --- | --- |
| forecastData | Input | The forecast data for this route or set of points, keep in mind a response may have a list of route forecasts but this is expecting a single forecast. | ``` <forecast-data-plot [forecastData]="fcstData" [validTimes]="validTimes"></forecast-data-plot> ``` |
| validTimes | Input | The array of valid times as UTC epoch timestamp, this is returned from backend with forecast data | |

### Forecast Map Component

Provides a Azure map with options to display tile layers and a slider to move through the times that images are available

| param | in/out | description | example |
| --- | --- | --- | --- |
| lbsKey | Input | Azure maps subscription key (previously named LBS) | ``` <forecast-map lbsKey="{{lbsKey}}"></forecast-map>  ```|

