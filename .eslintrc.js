module.exports = {
    "env": {
        "es2020": true,
        "node": true,
        "webextensions": true,
        "browser": true,
    },
    "globals": {
        "graphql": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
      // Relax, React!
      "react/jsx-filename-extension": "off",
      "react/jsx-no-bind": "off",
      "react/forbid-prop-types": "off",
      "react/no-children-prop": "off",
      "react/jsx-props-no-spreading": "off",
    },
    "settings": {
      "react": {
        "version": "detect",
      },
    },
};
