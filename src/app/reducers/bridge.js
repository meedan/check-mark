import { LOGIN_TWITTER, LOGIN_FACEBOOK, NOTIFY_SEND, NOTIFY_RECEIVE } from '../constants/ActionTypes';

export default function bridge(state = { provider: null }, action) {
  if (window.bgBadge && (action.type === NOTIFY_SEND || action.type === NOTIFY_RECEIVE)) {
    window.bgBadge(state.provider); return state;
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
