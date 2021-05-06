module.exports = {
    "env": {
        "es2020": true,
        "node": true,
        "webextensions": true,
        "browser": true,
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
    },
    "settings": {
      "react": {
        "version": "detect",
      },
    },
};
