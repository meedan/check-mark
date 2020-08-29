import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const MediaCell = ({ label, value, bold }) => {
  const classes = useStyles();
    
  const notAvailable = <FormattedMessage id="mediaCell.notAvailable" defaultMessage="Not available" />;

  const empty = (v) => {
    return v === undefined || v === null || v === '';
  };

  return (
    <Box className={classes.root}>
      <Typography variant="overline">
        {label}
      </Typography>
      <Typography variant="body1" style={bold ? { fontWeight: 'bold' } : {}}>
        {empty(value) ? notAvailable : value}
      </Typography>
    </Box>
  );
};

MediaCell.defaultProps = {
  bold: true,
};

MediaCell.propTypes = {
  label: PropTypes.object.isRequired,
  value: PropTypes.object.isRequired,
  bold: PropTypes.bool,
};

export default MediaCell;
