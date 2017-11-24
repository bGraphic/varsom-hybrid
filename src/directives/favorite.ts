import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  Renderer
} from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../store/reducers";
import * as FavoritesActions from "./../store/actions/favorites.actions";

@Directive({ selector: "[nveFavorite]" })
export class FavoriteDirective {
  @Input("nveFavorite") regionId: string;
  private _isFavorite: boolean;
  private _isFavoriteSubscription: Subscription;

  @HostListener("click")
  onClick() {
    this.toggleFavorite();
  }

  constructor(
    private _renderer: Renderer,
    private _el: ElementRef,
    private _store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this._isFavoriteSubscription = this._store
      .select(fromRoot.isFavorite(this.regionId))
      .subscribe(isFavorite => {
        console.log("Favorite", isFavorite);
        this._isFavorite = isFavorite;
        this._updateIcon();
      });
  }

  ngOnDestroy() {
    this._isFavoriteSubscription.unsubscribe();
  }

  private _updateIcon() {
    if (this._isFavorite) {
      this._renderer.setElementClass(this._el.nativeElement, "active", true);
    } else {
      this._renderer.setElementClass(this._el.nativeElement, "active", false);
    }
  }

  private toggleFavorite() {
    if (this._isFavorite) {
      this._store.dispatch(new FavoritesActions.RemoveAction(this.regionId));
    } else {
      this._store.dispatch(new FavoritesActions.AddAction(this.regionId));
    }
  }
}
