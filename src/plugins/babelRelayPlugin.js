// `babel-relay-plugin` returns a function for creating plugin instances
const getBabelRelayPlugin = require('babel-relay-plugin');

// load previously saved schema data
const schemaData = require('relay.json');

// create a plugin instance
const plugin = getBabelRelayPlugin(schemaData);

// compile code with babel using the plugin
return babel.transform(source, {
  plugins: [plugin],
});
