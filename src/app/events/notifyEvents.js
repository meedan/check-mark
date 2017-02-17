import { LOGIN_TWITTER, LOGIN_FACEBOOK, GO_BACK, SAVE_POST, SAVE_TRANSLATION, LIST_TRANSLATIONS, ERROR } from '../constants/ActionTypes';
import { sendNotification } from '../actions/extension';

const events = [
  {
    catch: [LOGIN_TWITTER, LOGIN_FACEBOOK, GO_BACK, SAVE_POST, SAVE_TRANSLATION, LIST_TRANSLATIONS, ERROR],
    dispatch: sendNotification
  }
];

export default events;
