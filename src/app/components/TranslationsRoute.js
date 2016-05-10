import Relay from 'react-relay';

class TranslationsRoute extends Relay.Route {
  static queries = {
    translation: () => Relay.QL`query { translation }`,
  };
  static paramDefinitions = {
  };
  static routeName = 'TranslationsRoute';
};

export default TranslationsRoute;
