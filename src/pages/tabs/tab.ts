import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ListPage } from '../list/list';

@Component({
  templateUrl: 'tab.html'
})
export class TabPage {

  rootPage: any = ListPage;
  forecastType: string;
  rootParams: {
    forecastType: string,
    itemsType: string
  }
  constructor(public navParams: NavParams) {
    this.forecastType = navParams.get('forecastType');
    this.rootParams = {
      forecastType: navParams.get('forecastType'),
      itemsType: navParams.get('itemsType')
    }
  }
}
