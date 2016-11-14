import { FirebaseObjectObservable } from 'angularfire2';

export class Area {
  private key: string;
  private id: string;
  private name: string;
  private forecast: FirebaseObjectObservable<any>;

  constructor(firebaseObject: any) {
    this.key = firebaseObject.$key;
    this.id = firebaseObject.Id;
    this.name = firebaseObject.Name;
  }

  getName(): string {
    return this.name;
  }

  getKey(): string {
    return this.key;
  }

  setForecast(forecastType: string, forecast: FirebaseObjectObservable<any>) {
    this.forecast = forecast;
  }

  getForecast(forecastType): FirebaseObjectObservable<any> {
    return this.forecast;
  }
}
