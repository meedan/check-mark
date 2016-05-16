import Relay from 'react-relay';

class TranslationsRoute extends Relay.Route {
  static queries = {
    me: () => Relay.QL`query { me }`, 
  };
  static paramDefinitions = {
  };
  static routeName = 'TranslationsRoute';
};

export default TranslationsRoute;
