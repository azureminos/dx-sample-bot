import _ from 'lodash';
import React, {createElement} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import {fade, withStyles} from '@material-ui/core/styles';
// ====== Icons ======
// Variables
const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
});

class PageSelectDest extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('>>>>PageSelectDest, render()', this.props);
    const {classes, plan, planExt, reference, pushToRemote} = this.props;
    const {cities, country} = planExt;
    let body = <div>Loading destination list</div>;

    if (!reference.destinations) {
      pushToRemote('ref:destination', {country});
    } else {
      body = <div>Loading destination list</div>;
    }
    // Local Variables
    // Sub Components
    // Display Widget
    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography
              align='center'
              className={classes.title}
              variant='h6'
              noWrap
            >
              Australia
            </Typography>
            <IconButton color='inherit'>
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {body}
        <div>Footer - Create new travel plan</div>
      </div>
    );
  }
}

export default withStyles(styles)(PageSelectDest);
