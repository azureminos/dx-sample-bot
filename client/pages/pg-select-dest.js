import _ from 'lodash';
import React, {createElement} from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from '@material-ui/core';
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

class PageSelectDest extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('>>>>PageSelectDest, render()', this.props);
    const {classes, plan, planExt, reference} = this.props;
    const {cities, country} = planExt;
    // Local Variables
    // Sub Components
    let body = <div>Empty destination list</div>;
    if (reference.destinations && reference.destinations.length > 0) {
      const getDestItem = (d) => {
        return <div key={d.destinationId}>{d.name}</div>;
      };
      body = (
        <div>
          <div>
            <div>{`${cities.length} Cit${
              cities.length > 1 ? 'ies' : 't'
            }`}</div>
            <div>{cities.length > 0 ? cities.toString() : ''}</div>
          </div>
          <div>{_.map(reference.destinations, getDestItem)}</div>
        </div>
      );
    }

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
        <AppBar
          position='fixed'
          color='default'
          className={classes.appBarFooter}
        >
          <Toolbar className={classes.toolbarFooter}>
            <Button fullWidth color='primary'>
              Next
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(PageSelectDest);
