import { FirebaseListObservable } from 'angularfire2';

export class Area {
  private key: string;
  private id: string;
  private name: string;
  private forecast: FirebaseListObservable<any>;

  constructor(firebaseObject: any) {
    this.key = firebaseObject.$key;
    this.id = firebaseObject.Id;
    this.name = firebaseObject.Name;
  }

  getName(): string {
    return this.name;
  }

  setForecast(forecastType: string, forecast: FirebaseListObservable<any>) {
    this.forecast = forecast;
  }

  getForecast(forecastType): FirebaseListObservable<any> {
    console.log("Forecst", this.forecast);
    return this.forecast;
  }
}
