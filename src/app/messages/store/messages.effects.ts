import {MatSnackBar} from "@angular/material/snack-bar";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {addMessageAction, addMessageFinishedAction} from "./messages.actions";
import {map} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class MessagesEffects {
  constructor(private actions$: Actions,
              private snackBar: MatSnackBar) {
  }

  showSnackbar$ = createEffect(() =>
      this.actions$.pipe(
          ofType(addMessageAction),
          map((action) => {
            this.snackBar.open(action.message.text, "OK");
            return addMessageFinishedAction();
          })
      ));
}
