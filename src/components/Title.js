import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import colors from './colors';

const useStyles = makeStyles(() => ({
  title: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 900,
    fontSize: 21,
    letterSpacing: -1,
    color: colors.blue,
  },
}));

const Title = () => {
  const classes = useStyles();

  return (
    <Typography
      className={classes.title}
      variant="h1"
    >
      Check
    </Typography>
  );
};

export default Title;
