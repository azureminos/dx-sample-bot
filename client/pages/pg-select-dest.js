import _ from 'lodash';
import React, {createElement} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import StarBorderIcon from '@material-ui/icons/StarBorder';
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
  cityGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  cityGridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
  cityTitle: {
    color: theme.palette.primary.light,
  },
  cityTitleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
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
      const getCityGrid = (c) => {
        return (
          <GridListTile key={c.destinationId}>
            <div>
              <img
                src={
                  'https://www.eainsurance.com.au/wp-content/uploads/2020/05/Travel1.jpg'
                }
                alt={c.name}
              />
              <div>{c.name}</div>
            </div>
            <GridListTileBar
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                <IconButton aria-label={`star ${c.title}`}>
                  <StarBorderIcon className={classes.title} />
                </IconButton>
              }
            />
          </GridListTile>
        );
      };
      body = (
        <div>
          <div>
            <div>{`${cities.length} Cit${
              cities.length > 1 ? 'ies' : 't'
            }`}</div>
            <div>{cities.length > 0 ? cities.toString() : ''}</div>
          </div>
          <div className={classes.root}>
            <GridList
              cellHeight={180}
              className={classes.cityGridList}
              cols={1}
            >
              {reference.destinations.map(getCityGrid)}
            </GridList>
          </div>

          <div>{_.map(reference.destinations, getCityGrid)}</div>
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
