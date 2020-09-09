import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MaterialMenu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import colors from './colors';
import { logout } from './../helpers';
import config from './../config';

/* global window */

const Menu = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeWorkspace = () => {
    window.open(`${config.checkWebUrl}/check/me/teams`);
  };

  const handleLogout = () => {
    logout(() => {
      onLogout();
    });
  };

  return (
    <Box>
      <IconButton color={colors.darkGray} onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <MaterialMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleChangeWorkspace}>
          <FormattedMessage id="menu.changeWorkspace" defaultMessage="Switch workspace" />
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <FormattedMessage id="menu.logout" defaultMessage="Log out" />
        </MenuItem>
      </MaterialMenu>
    </Box>
  );
};

Menu.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Menu;
