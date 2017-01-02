import { Directive, ElementRef, Input, HostListener, Renderer } from '@angular/core';
import { FavoriteService } from "../providers/favorites";
import { Subscription } from "rxjs";

@Directive({ selector: '[nveFavorite]' })
export class FavoriteDirective {

  @Input('nveFavorite') areaId: string;
  private isFavorite: boolean = false;
  private _subscriptions: Subscription[] = [];

  @HostListener('click') onClick() {
    this.toggleFavorite();
  }

  constructor(private _renderer: Renderer, private _el: ElementRef, private _favorites: FavoriteService) {

  }

  ngOnInit() {
    let favoritesSubscription = this._favorites.favoriteAreaIds$
      .subscribe(favorites => {
        this.isFavorite = favorites.indexOf(this.areaId) > -1;
        this._updateIcon();
      })
    this._subscriptions.push(favoritesSubscription);
  }

  ngOnDestroy() {
    for(let subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  private _updateIcon() {
    if(this.isFavorite) {
      this._renderer.setElementClass(this._el.nativeElement, 'active', true);
    } else {
      this._renderer.setElementClass(this._el.nativeElement, 'active', false);
    }
  }

  private toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    this._updateIcon();

    if(this.isFavorite) {
      this._favorites.addFavoriteArea(this.areaId);
    } else {
      this._favorites.removeFavoriteArea(this.areaId);
    }
  }

}
