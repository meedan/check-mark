import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Message from './Message';

const useStyles = makeStyles(theme => ({
  paragraph: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const Loading = ({ message }) => {
  const classes = useStyles();

  return (
    <Message>
      <Typography variant="body1" className={classes.paragraph}>
        {message}
      </Typography>
    </Message>
  );
};

Loading.defaultProps = {
  message: <FormattedMessage id="loading.loading" defaultMessage="Loading..." />,
};

Loading.propTypes = {
  message: PropTypes.object,
};

export default Loading;
