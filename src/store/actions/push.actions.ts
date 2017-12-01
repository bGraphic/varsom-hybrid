import { Action } from "@ngrx/store";
import { PushToken, IPushMessage } from "@ionic/cloud-angular";

export const REGISTER = "[Push] Register";
export const REGISTER_SUCESS = "[Push] Registration Suceeded";
export const SUBSCRIBE = "[Push] Subscribe";
export const NEW_MESSAGE = "[Push] New message";
export const UPDATE_SUBSCRIPTION = "[Push] Update subscription";
export const ERROR = "[Push] Error";

export class RegisterAction implements Action {
  readonly type = REGISTER;
  constructor() {}
}

export class RegistrationSuceededAction implements Action {
  readonly type = REGISTER_SUCESS;
  constructor(public payload: PushToken) {}
}

export class SubscribeAction implements Action {
  readonly type = SUBSCRIBE;
  constructor() {}
}

export class NewMessage implements Action {
  readonly type = NEW_MESSAGE;
  constructor(public payload: IPushMessage) {}
}

export class UpdateSubscriptions implements Action {
  readonly type = UPDATE_SUBSCRIPTION;
  constructor(public payload: { regionId: string; isAdd: boolean }) {}
}

export class ErrorAction implements Action {
  readonly type = ERROR;
  constructor(public payload: any) {}
}

export type All =
  | RegisterAction
  | RegistrationSuceededAction
  | SubscribeAction
  | NewMessage
  | UpdateSubscriptions
  | ErrorAction;
