import { LOGIN_TWITTER, LOGIN_FACEBOOK } from '../constants/ActionTypes';
import { sendNotification } from '../actions/extension';

const events = [
  {
    catch: [LOGIN_TWITTER, LOGIN_FACEBOOK],
    dispatch: sendNotification
  }
];

export default events;
