import { Component } from '@angular/core';

import { TabPage } from '../tabs/tab';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tabBarElement: any;

  floodRoot: any = TabPage;
  landSlideRoot: any = TabPage;
  avalancheRoot: any = TabPage;

  floodParams: { forecastType: string, 'itemsType': string };
  landslideParams: { forecastType: string, 'itemsType': string };
  avalancheParams: { forecastType: string, 'itemsType': string };

  constructor() {
    this.floodParams = { forecastType: 'flood', itemsType: 'county'}
    this.landslideParams = { forecastType: 'landslide', itemsType: 'county'}
    this.avalancheParams = { forecastType: 'avlanche', itemsType: 'region'}

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewWillEnter() {
    console.log("test");
    this.tabBarElement.style.display = 'none';
  }
}
