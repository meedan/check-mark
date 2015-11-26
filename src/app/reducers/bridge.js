import { LOGIN_TWITTER, LOGIN_FACEBOOK, NOTIFY_SEND, NOTIFY_RECEIVE } from '../constants/ActionTypes';
import util from 'util';

export default function bridge(state = { provider: null }, action) {
  if (action.type === NOTIFY_SEND || action.type === NOTIFY_RECEIVE) {
    return state;
  }

  switch (action.type) {
    case LOGIN_TWITTER:
      return { ...state, provider: 'twitter' };
    case LOGIN_FACEBOOK:
      return { ...state, provider: 'facebook' };
    default:
      return state;
  }
}
