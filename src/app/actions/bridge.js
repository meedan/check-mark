import { LOGIN_TWITTER, LOGIN_FACEBOOK } from '../constants/ActionTypes';

export function loginTwitter() {
  return { type: LOGIN_TWITTER };
}

export function loginFacebook() {
  return { type: LOGIN_FACEBOOK };
}
