import { PushToken, IPushMessage } from '@ionic/cloud-angular';
import { Action } from '@ngrx/store';
export const REGISTER = '[Push] Register';
export const REGISTER_SUCESS = '[Push] Register Sucess';
export const REGISTER_FAIL = '[Push] Register Fail';
export const SUBSCRIBE = '[Push] Subscribe';
export const SUBSCRIBE_SUCESS = '[Push] Subscribe Sucess';
export const SUBSCRIBE_FAIL = '[Push] Subscribe Fail';
export const NEW_MESSAGE = '[Push] New Message';

export class RegisterAction implements Action {
  readonly type = REGISTER;

  constructor() { }
}

export class RegisterSucessAction implements Action {
  readonly type = REGISTER_SUCESS;

  constructor(public payload: PushToken) { }
}

export class RegisterFailAction implements Action {
  readonly type = REGISTER_FAIL;

  constructor(public payload: any) { }
}

export class SubscribeAction implements Action {
  readonly type = SUBSCRIBE;

  constructor() { }
}

export class SubscribeSucessAction implements Action {
  readonly type = SUBSCRIBE_SUCESS;

  constructor(public payload: PushToken) { }
}

export class SubscribeFailAction implements Action {
  readonly type = SUBSCRIBE_FAIL;

  constructor(public payload: any) { }
}

export class NewMessageAction implements Action {
  readonly type = NEW_MESSAGE;

  constructor(public payload: IPushMessage) {}
}

export type Actions
  = RegisterAction
  | RegisterSucessAction
  | RegisterFailAction
  | SubscribeAction
  | SubscribeSucessAction
  | SubscribeFailAction
  | NewMessageAction;