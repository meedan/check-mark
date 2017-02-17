import { combineReducers } from 'redux';
import bridge from './bridge';
import extension from './extension';

export default combineReducers({ bridge, extension });
