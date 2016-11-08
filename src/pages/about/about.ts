import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  forecastType: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.forecastType = navParams.get('forecastType');
  }

}
