import { Forecast } from "./Forecast"

export class Area {
  private forecasts: {
    highest: Forecast,
    flood: Forecast,
    landslide: Forecast
  };
  constructor(
    public id: number,
    public name: string,
    public type: string,
  ) {
    this.forecasts = {
      highest: new Forecast(),
      flood: new Forecast(),
      landslide: new Forecast()
    }
  }

  getForecast(type:string) {
    if('highest' == type) {
      return this.forecasts.highest;
    } else if('flood' == type) {
      return this.forecasts.flood;
    } else if('landslide' == type) {
      return this.forecasts.landslide;
    } else {
      console.log('Could not find forecast type', type);
    }

  }
}
