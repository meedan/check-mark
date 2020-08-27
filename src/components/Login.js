import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Title from './Title';
import config from './../config';
import colors from './colors';

/* global window */

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  header: {
    padding: theme.spacing(2),
    background: colors.lightGray,
  },
  button: {
    background: colors.blue,
  },
  paragraph: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const Login = () => {
  const classes = useStyles();

  const signIn = () => {
    window.open(config.checkWebUrl, 'Check Web');
  };

  return (
    <Box id="login">
      <Box className={classes.header}>
        <Title />
      </Box>
      <Box className={classes.root}>
        <Typography variant="body1" className={classes.paragraph}>
          <FormattedMessage
            id="Login.addLinksToApp"
            defaultMessage="Add links to Check with one click. Links will be added to your selected list. If the link already exists, you are able to annotate it."
            values={{ app: config.appName }}
          />
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <FormattedMessage id="Login.start" defaultMessage="To get started, sign in and then reload the page." />
        </Typography>
        <Box>
          <Button id="login-button" variant="contained" color="primary" onClick={signIn} className={classes.button}>
            <FormattedMessage id="Login.signIn" defaultMessage="Sign In" />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
