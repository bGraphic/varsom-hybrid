import { Directive, Output, HostListener } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import * as fromRoot from "./../store/reducers";
import * as WarningsActions from "./../store/actions/warnings.actions";
import { Observable } from "rxjs/Observable";
import { SectionType } from "../store/models/Section";

@Directive({ selector: "[nveRefresher]" })
export class RefreshDirective {
  private _fetching$: Observable<boolean>;
  private _section$: Observable<SectionType>;
  constructor(private _store: Store<fromRoot.State>) {
    this._fetching$ = this._store.select(fromRoot.getSectionFetching);
    this._section$ = this._store.select(fromRoot.getSelectedSection);
  }

  @HostListener("ionRefresh", ["$event"])
  doRefresh(refresher) {
    this._section$.first().subscribe(section => {
      if (section === "Avalanche") {
        this._store.dispatch(
          new WarningsActions.FetchAction({ warningType: "Avalanche" })
        );
      } else {
        this._store.dispatch(
          new WarningsActions.FetchAction({ warningType: "Flood" })
        );
        this._store.dispatch(
          new WarningsActions.FetchAction({ warningType: "Landslide" })
        );
      }

      this._fetching$
        // Also react to section changes
        .merge(this._section$.skip(1))
        .filter(fetching => !fetching)
        .first()
        .subscribe(fetching => {
          refresher.complete();
        });
    });
  }
}
