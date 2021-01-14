import _ from 'lodash';
import React, {createElement} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import SearchIcon from '@material-ui/icons/Search';

import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
// Variables
const styles = (theme) => ({
  root: {},

  appBarFooter: {
    position: 'fixed',
    width: '100%',
    top: 'auto',
    bottom: 0,
  },
  toolbarFooter: {
    display: 'block',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    minHeight: '16px',
  },
});

class PagePlanTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // Event Handler
  // Display page
  render() {
    console.log('>>>>PagePlanTrip, render()', this.props);
    const {classes} = this.props;
    // Local Variables
    // Sub Components
    const body = <div>tabs</div>;

    // Display Widget
    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <div>
              <div>Date Selector</div>
              <div>Search</div>
            </div>
          </Toolbar>
        </AppBar>
        {body}
        <AppBar
          position='fixed'
          color='default'
          className={classes.appBarFooter}
        >
          <Toolbar className={classes.toolbarFooter}>
            <Button fullWidth color='primary'>
              Complete
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(PagePlanTrip);
