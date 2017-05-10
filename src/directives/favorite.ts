import { Directive, ElementRef, Input, HostListener, Renderer } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";
import { Store } from '@ngrx/store';

import * as fromRoot from './../store/reducers';
import * as favorites from './../store/actions/favorite.actions';

@Directive({ selector: '[nveFavorite]' })
export class FavoriteDirective {

  @Input('nveFavorite') areaId: string;
  private _isFavorite$: Observable<boolean>;
  private _subscriptions: Subscription[] = [];

  @HostListener('click') onClick() {
    this.toggleFavorite();
  }

  constructor(private _renderer: Renderer, private _el: ElementRef, private _store: Store<fromRoot.State>) {
    this._isFavorite$ = this._store.select(fromRoot.getFavoriteAreaIds)
      .map((areaIds) => {
        return areaIds.indexOf(this.areaId) > -1;
      });
  }

  ngOnInit() {
    let favoritesSubscription = this._isFavorite$
      .subscribe(isFavorite => {
        this._updateIcon(isFavorite);
      })
    this._subscriptions.push(favoritesSubscription);
  }

  ngOnDestroy() {
    for(let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  private _updateIcon(isFavorite) {
    if(isFavorite) {
      this._renderer.setElementClass(this._el.nativeElement, 'active', true);
    } else {
      this._renderer.setElementClass(this._el.nativeElement, 'active', false);
    }
  }

  private toggleFavorite() {    
    this._store.dispatch(new favorites.ToggleAction(this.areaId));
  }
}
