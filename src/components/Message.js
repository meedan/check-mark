import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Title from './Title';
import colors from './colors';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  header: {
    padding: theme.spacing(2),
    background: colors.lightGray,
  },
}));

const Message = (props) => {
  const classes = useStyles();

  return (
    <Box id="message">
      <Box className={classes.header}>
        <Title />
      </Box>
      <Box className={classes.root}>
        {props.children}
      </Box>
    </Box>
  );
};

Message.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Message;
