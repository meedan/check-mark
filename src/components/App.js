import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { createMuiTheme, Box, ThemeProvider } from '@material-ui/core';
import { RelayEnvironmentProvider } from 'react-relay';
import Login from './Login';
import SaveOrUpdate from './SaveOrUpdate';
import Loading from './Loading';
import { loggedIn } from './../helpers';
import { createEnvironment } from './../relay/Environment';

const App = (props) => {
  const [state, setState] = useState({ user: null, loaded: false });

  const user = state.user;
  const loaded = state.loaded;

  useEffect(() => {
    loggedIn((user) => {
      setState({ user, loaded: true });
    });
  }, []);

  let environment = null;
  if (user) {
    environment = createEnvironment(user.token, '');
  }

  const handleLogout = () => {
    setState({ user: null, loaded });
  };

  const muiTheme = createMuiTheme({
    palette: {
      primary: {
        main: '#2f80ed',
      },
    },
    typography: {
      fontSize: 13,
    },
  });

  return (
    <RelayEnvironmentProvider environment={environment}>
      <ThemeProvider theme={muiTheme}>
        <Box id="app" style={{ direction: props.direction }}>
          {user ? (
            <SaveOrUpdate
              user={user}
              environment={environment}
              url={props.url}
              text={props.text}
              onLogout={handleLogout}
            />
          ) : loaded ? (
            <Login />
          ) : (
            <Loading
              message={
                <FormattedMessage
                  id="app.loading"
                  defaultMessage="Authenticating on Check…"
                />
              }
            />
          )}
        </Box>
      </ThemeProvider>
    </RelayEnvironmentProvider>
  );
};

App.propTypes = {
  direction: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default App;
