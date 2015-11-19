import configureStore from 'app/store/configureStore';
import createMenu from './contextMenus';
import initBadge from './badge';

configureStore(store => {
  window.store = store;
  createMenu();
  initBadge(store.getState().bridge.bridge);

  if (__DEVELOPMENT__) {
    require('./inject');
  }

}, true);
