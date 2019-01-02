import React, {createElement} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import BeachIcon from '@material-ui/icons/BeachAccess';
import _ from 'lodash';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    paddingLeft: theme.spacing.unit,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

/*
 * Button to HomeFooter firends by invoking the share menu
 */
const HomeFooter = ({
  instPackage,
  apiUri,
  classes,
}) => {
  console.log('>>>>Start HomeFooter', {instPackage: instPackage, apiUri: apiUri});
  return (
    <AppBar position='fixed' color='default' className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Button
          variant='contained'
          color='primary'
          fullWidth='true'
          className={classes.button}
        >
          View Package
          <BeachIcon className={classes.leftIcon}/>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles, {withTheme: true})(HomeFooter);
