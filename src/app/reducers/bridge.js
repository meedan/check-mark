import { LOGIN_TWITTER, LOGIN_FACEBOOK, NOTIFY_SEND, NOTIFY_RECEIVE } from '../constants/ActionTypes';

export default function bridge(state = { session: null }, action) {
  if (action.type === NOTIFY_SEND || action.type === NOTIFY_RECEIVE) {
    return state;
  }

  switch (action.type) {
    case LOGIN_TWITTER:
      return { session: action.session, provider: 'twitter', view: 'menu' };
    case LOGIN_FACEBOOK:
      return { session: action.session, provider: 'facebook', view: 'menu' };
    default:
      return state;
  }
}
