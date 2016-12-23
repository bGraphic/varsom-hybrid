import { Pipe, PipeTransform } from '@angular/core';
import { Forecast } from "../models/Forecast";


@Pipe({ name: 'filterForecasts' })
export class FilterForecastsPipe implements PipeTransform {
  transform(forecasts: Forecast[], regionType?: string) {
    if("B_REGIONS" === regionType) {
      return Forecast.filterBRegions(forecasts);
    } else {
      return Forecast.filterARegions(forecasts);
    }
  }
}

@Pipe({ name: 'forecastsTimeframe' })
export class ForecastsTimeframePipe implements PipeTransform {
  transform(forecasts: Forecast[]) {
    return Forecast.getTimeframeFromForecasts(forecasts);
  }
}
