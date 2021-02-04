import _ from 'lodash';
import React, {createElement} from 'react';
import 'react-dates/initialize';
import {DateRangePicker} from 'react-dates';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import LocationSearchInput from '../components-v2/location-search-input';
import Helper from '../../lib/helper';
// ====== Icons && CSS ======
import 'react-dates/lib/css/_datepicker.css';

// Variables
const styles = (theme) => ({
  root: {
    height: '100%',
  },
  whitespaceTop: {
    height: 100,
  },
  whitespaceBottom: {
    height: 50,
  },
  hAppBar: {
    position: 'fixed',
    width: '100%',
    top: 0,
    bottom: 'auto',
  },
  hToolbar: {
    display: 'block',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    minHeight: '16px',
  },
  hDatePicker: {
    display: 'flex',
  },
  hAddressBar: {
    display: 'flex',
  },
  bRoot: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 'fit-content',
    width: '100%',
  },
  bGridSelected: {
    border: '4px solid black',
  },
  bGridUnselected: {
    border: 'none',
  },
  fAppBar: {
    position: 'fixed',
    width: '100%',
    top: 'auto',
    bottom: 0,
  },
  fToolbar: {
    display: 'block',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    minHeight: '16px',
  },
});

// Functions
// Class
class PageStartTrip extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doHandleBtnStartTrip = this.doHandleBtnStartTrip.bind(this);
    this.doHandleAddressChange = this.doHandleAddressChange.bind(this);
    this.doHandleDateRangeChange = this.doHandleDateRangeChange.bind(this);
    this.doHandleTagGroupChange = this.doHandleTagGroupChange.bind(this);
    // Init state
    this.state = {
      focusedDateInput: null,
      selectedAddress: '',
      selectedLocation: '',
    };
  }
  // Event Handler
  doHandleBtnStartTrip(e) {
    console.log('>>>>PageStartTrip.doHandleBtnStartTrip', e);
  }
  doHandleAddressChange = ({address, location, destinations}) => {
    console.log('>>>>PageStartTrip.doHandleAddressChange', {address, location});
    if (location) {
      const closeCity = Helper.findCloseCity(location, destinations);
      console.log(
        '>>>>PageStartTrip.doHandleAddressChange Close City',
        closeCity
      );
      if (!closeCity) {
        // Enter a new location
        this.setState({selectedAddress: '', selectedLocation: ''});
      } else {
        this.setState({
          selectedAddress: closeCity.name,
          selectedLocation: location,
        });
        const {actions} = this.props;
        if (actions && actions.handleSetStartCity) {
          actions.handleSetStartCity(closeCity);
        }
      }
    } else {
      this.setState({selectedAddress: address, selectedLocation: location});
    }
  };
  doHandleDateRangeChange(input) {
    console.log('>>>>PageStartTrip.doHandleDateRangeChange', input);
    const {actions} = this.props;
    if (actions && actions.handleDateRangeChange) {
      actions.handleDateRangeChange(input);
    }
  }
  doHandleTagGroupChange(name) {
    console.log('>>>>PageStartTrip.doHandleTagGroupChange', name);
    const {actions} = this.props;
    if (actions && actions.handleTagGroupChange) {
      actions.handleTagGroupChange(name);
    }
  }
  // Display page
  render() {
    console.log('>>>>PageStartTrip, render()', this.props);
    const {classes, plan, planExt, reference} = this.props;
    const {tagGroups, destinations} = reference;
    const {startDate, endDate} = plan;
    const {selectedTagGroups} = planExt;
    const {focusedDateInput, selectedAddress} = this.state;
    // Local Functions
    const getHeader = () => {
      let header = <div />;
      header = (
        <AppBar position='fixed' color='default' className={classes.hAppBar}>
          <Toolbar className={classes.hToolbar}>
            <div>
              <div className={classes.hDatePicker}>
                <label>Trip Dates</label>
                <DateRangePicker
                  startDate={startDate}
                  startDateId='trip_start_date_id'
                  endDate={endDate}
                  endDateId='trip_end_date_id'
                  numberOfMonths={1}
                  small
                  showClearDates
                  reopenPickerOnClearDates
                  onDatesChange={this.doHandleDateRangeChange}
                  focusedInput={focusedDateInput}
                  onFocusChange={(focusedInput) =>
                    this.setState({focusedDateInput: focusedInput})
                  }
                />
              </div>
              <div className={classes.hAddressBar}>
                <label>Start City</label>
                <LocationSearchInput
                  handleChange={({address, location}) => {
                    this.doHandleAddressChange({
                      address,
                      location,
                      destinations,
                    });
                  }}
                  address={selectedAddress}
                />
              </div>
            </div>
          </Toolbar>
        </AppBar>
      );
      return header;
    };

    const getBody = () => {
      const getGridTagGroup = (t) => {
        const isSelected = !!_.find(selectedTagGroups, (g) => {
          return t.name === g;
        });
        return (
          <Grid item xs={4} key={t._id}>
            <div
              onClick={() => {
                this.doHandleTagGroupChange(t.name);
              }}
              className={
                isSelected ? classes.bGridSelected : classes.bGridUnselected
              }
            >
              {t.name}
            </div>
          </Grid>
        );
      };

      const body = (
        <div>
          <div>Pick your interests</div>
          <Grid container spacing={2}>
            {_.map(tagGroups, (t) => {
              return getGridTagGroup(t);
            })}
          </Grid>
        </div>
      );
      return body;
    };
    const getFooter = (isDateSelected) => {
      let footer = <div />;
      if (isDateSelected) {
        footer = (
          <AppBar position='fixed' color='default' className={classes.fAppBar}>
            <Toolbar className={classes.fToolbar}>
              <Button
                fullWidth
                color='primary'
                onClick={this.handleBtnComplete}
              >
                Start My Holiday
              </Button>
            </Toolbar>
          </AppBar>
        );
      }
      return footer;
    };
    // Local Variables
    const isDateSelected =
      startDate && endDate && endDate.diff(startDate, 'days') >= 0;
    // Sub Components
    // Display Widget
    return (
      <div className={classes.root}>
        {getHeader()}
        <div className={classes.whitespaceTop} />
        {getBody()}
        <div className={classes.whitespaceBottom} />
        {getFooter(isDateSelected)}
      </div>
    );
  }
}

export default withStyles(styles)(PageStartTrip);
