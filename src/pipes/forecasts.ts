import { Pipe, PipeTransform } from '@angular/core';
import { Forecast } from "../store/models/Forecast";
import { AreaUtils } from "../utils/area-utils";


@Pipe({ name: 'filterForecasts' })
export class FilterForecastsPipe implements PipeTransform {
  transform(forecasts: Forecast[], regionType?: string) {
    if("B_REGIONS_ACTIVE" === regionType) {
      return Forecast.filterBRegionsActive(forecasts);
    } else if("B_REGIONS" === regionType) {
      return Forecast.filterBRegions(forecasts);
    } else {
      return Forecast.filterARegions(forecasts);
    }
  }
}

@Pipe({
  name: 'favoriteForecasts',
  pure: false
})
export class FavoriteForecastsPipe implements PipeTransform {
  transform(forecasts: Forecast[], favoriteIds?: string[]) {
    let favoriteForecasts = [];
    for(let areaId of favoriteIds) {
      let favorite = Forecast.findForecastWithAreaId(forecasts, areaId);
      if(!favorite) {
        areaId = AreaUtils.getParentId(areaId);
        favorite = Forecast.findForecastWithAreaId(forecasts, areaId);
      }

      if(favorite && !Forecast.findForecastWithAreaId(favoriteForecasts, areaId)) {
        favoriteForecasts.push(favorite);
      }
    }
    return favoriteForecasts;
  }
}

@Pipe({ name: 'forecastsTimeframe' })
export class ForecastsTimeframePipe implements PipeTransform {
  transform(forecasts: Forecast[]) {
    return Forecast.getTimeframeFromForecasts(forecasts);
  }
}
