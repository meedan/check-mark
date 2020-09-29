import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Box from '@material-ui/core/Box';
import Login from './Login';
import SaveOrUpdate from './SaveOrUpdate';
import Loading from './Loading';
import { loggedIn } from './../helpers';
import { createEnvironment } from './../relay/Environment';

const App = (props) => {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loggedIn((user) => {
      setUser(user);
      setLoaded(true);
    });
  }, []);

  let environment = null;
  if (user) {
    environment = createEnvironment(user.token, '', null);
  }

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Box id="app" style={{ direction: props.direction }}>
      { user ?
        <SaveOrUpdate
          user={user}
          environment={environment}
          url={props.url}
          text={props.text}
          onLogout={handleLogout}
        /> :
        (loaded ? <Login /> : <Loading message={<FormattedMessage id="app.loading" defaultMessage="Authenticating on Check…" />} />)
      }
    </Box>
  );
};

App.propTypes = {
  direction: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default App;
