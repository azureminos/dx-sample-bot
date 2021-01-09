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
import StarIcon from '@material-ui/icons/Star';
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
  cityTile: {
    padding: '0px',
  },
  cityTitle: {
    color: theme.palette.primary.light,
  },
  cityTitleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  cityItem: {
    display: 'flex',
    borderStyle: 'solid',
    borderColor: 'blue',
  },
  cityText: {
    display: 'block',
  },
  cityTextName: {},
  cityTextDesc: {},
});

class PageSelectDest extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddCity = this.handleAddCity.bind(this);
    this.state = {
      cities: props.cities || [],
    };
  }
  // Event Handler
  handleAddCity(e, c) {
    console.log('>>>>PageSelectDest, handleAddCity()', c);
    e.preventDefault();
    const {cities} = this.state;
    const isSelected = _.find(cities, function(o) {
      return o === c.name;
    });
    if (!isSelected) {
      cities.push(c.name);
    } else {
      _.remove(cities, function(o) {
        return o === c.name;
      });
    }

    this.setState({cities: cities});
  }
  // Display page
  render() {
    console.log('>>>>PageSelectDest, render()', this.props);
    const {classes, reference} = this.props;
    const {cities} = this.state;
    // Local Variables
    // Sub Components
    let body = <div>Empty destination list</div>;
    if (reference.destinations && reference.destinations.length > 0) {
      const getCityGrid = (c) => {
        const isSelected = _.find(cities, function(o) {
          return o === c.name;
        });
        return (
          <GridListTile
            cols={1}
            key={c.destinationId}
            classes={{
              root: classes.cityTile,
            }}
          >
            <div className={classes.cityItem}>
              <img
                height='100'
                src={
                  'https://www.eainsurance.com.au/wp-content/uploads/2020/05/Travel1.jpg'
                }
                alt={c.name}
              />
              <div className={classes.cityText}>
                <div className={classes.cityTextName}>{c.name}</div>
                <div className={classes.cityTextDesc}>
                  {'Best for 3 Days 2 nights'}
                </div>
              </div>
            </div>
            <GridListTileBar
              classes={{
                root: classes.cityTitleBar,
                title: classes.cityTitle,
              }}
              actionPosition='left'
              actionIcon={
                <IconButton
                  aria-label={`star ${c.title}`}
                  onClick={(e) => this.handleAddCity(e, c)}
                >
                  {isSelected ? (
                    <StarIcon style={{color: 'gold'}} />
                  ) : (
                    <StarBorderIcon className={classes.cityTitle} />
                  )}
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
              cities.length > 1 ? 'ies' : 'y'
            }`}</div>
            <div>{cities.length > 0 ? cities.toString() : ''}</div>
          </div>
          <GridList
            cellHeight={'auto'}
            cols={1}
            spacing={4}
            className={classes.cityGrid}
          >
            {_.map(reference.destinations, getCityGrid)}
          </GridList>
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
