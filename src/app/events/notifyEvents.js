import { LOGIN_TWITTER, LOGIN_FACEBOOK, GO_BACK } from '../constants/ActionTypes';
import { sendNotification } from '../actions/extension';

const events = [
  {
    catch: [LOGIN_TWITTER, LOGIN_FACEBOOK, GO_BACK],
    dispatch: sendNotification
  }
];

export default events;
