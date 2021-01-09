import _ from 'lodash';
import React, {createElement} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/InputBase';
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
    const {classes} = this.props;
    // Local Variables
    // Sub Components
    // Display Widget
    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography className={classes.title} variant='h6' noWrap>
              Australia
            </Typography>
            <IconButton color='inherit'>
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div>Body - List my travel plans</div>
        <div>Footer - Create new travel plan</div>
      </div>
    );
  }
}

export default withStyles(styles)(PageSelectDest);
