import _ from 'lodash';
import React, {createElement} from 'react';
import 'react-dates/initialize';
import {DateRangePicker} from 'react-dates';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import LocationSearchInput from '../components-v2/location-search-input';
import PopupMessage from '../components-v2/popup-message';
import Helper from '../../lib/helper';
import CONSTANTS from '../../lib/constants';
// ====== Icons && CSS ======
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import DateRangeIcon from '@material-ui/icons/DateRange';
import PeopleIcon from '@material-ui/icons/People';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import MinusBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import 'react-dates/lib/css/_datepicker.css';

// Variables
const {Global} = CONSTANTS.get();
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
  hDivFlex: {
    display: 'flex',
    margin: 'auto',
  },
  hDivPeopleDisplay: {
    padding: '4px',
    margin: 'auto',
  },
  hDivPeopleControl: {
    minWidth: '32px',
    padding: '4px',
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
    this.dohandleBtnStartHoliday = this.dohandleBtnStartHoliday.bind(this);
    this.doHandleAddressChange = this.doHandleAddressChange.bind(this);
    this.doHandleDateRangeChange = this.doHandleDateRangeChange.bind(this);
    this.doHandleTagGroupChange = this.doHandleTagGroupChange.bind(this);
    this.doHandlePeopleChange = this.doHandlePeopleChange.bind(this);
    this.handlePopupClose = this.handlePopupClose.bind(this);
    // Init state
    this.state = {
      focusedDateInput: null,
      selectedAddress: '',
      selectedLocation: '',
      popup: {
        open: false,
        title: '',
        messge: '',
      },
    };
  }
  // Event Handler
  handlePopupClose() {
    console.log('>>>>PageStartTrip.handlePopupClose');
    const popup = {open: false, title: '', message: ''};
    this.setState({popup});
  }
  dohandleBtnStartHoliday(plan) {
    console.log('>>>>PageStartTrip.dohandleBtnStartHoliday', plan);
    const {startDate, endDate, startCity} = plan;
    if (!startDate || !endDate) {
      const popup = {
        open: true,
        title: 'Holiday dates not selected',
        message: 'Please select the holiday start and end date',
      };
      this.setState({popup});
    } else if (!startCity) {
      const popup = {
        open: true,
        title: 'Home city not found',
        message: 'Please enter a valid address for the home city',
      };
      this.setState({popup});
    } else {
      const {actions} = this.props;
      if (actions && actions.handleBtnStartHoliday) {
        actions.handleBtnStartHoliday();
      }
    }
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
        const popup = {
          open: true,
          title: 'Home city not found',
          message: 'Please enter a valid address for the home city',
        };
        this.setState({selectedAddress: '', selectedLocation: '', popup});
      } else {
        const popup = {
          open: true,
          title: 'Home city found',
          message: `Home city has been updated as the nearest city ${closeCity.name}`,
        };
        this.setState({
          selectedAddress: closeCity.name,
          selectedLocation: location,
          popup,
        });
        const {actions} = this.props;
        if (actions && actions.handleSetStartCity) {
          actions.handleSetStartCity(closeCity);
        }
      }
    } else {
      this.setState({selectedAddress: address, selectedLocation: ''});
    }
  };
  doHandleDateRangeChange(input) {
    console.log('>>>>PageStartTrip.doHandleDateRangeChange', input);
    const {actions} = this.props;
    if (actions && actions.handleDateRangeChange) {
      actions.handleDateRangeChange(input);
    }
  }
  doHandlePeopleChange(input) {
    console.log('>>>>PageStartTrip.doHandlePeopleChange', input);
    const {actions} = this.props;
    if (actions && actions.handlePeopleChange) {
      actions.handlePeopleChange(input);
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
    const {startDate, endDate, totalPeople} = plan;
    const {selectedTagGroups} = planExt;
    const {focusedDateInput, selectedAddress, popup} = this.state;
    const isNotAllowAdd = totalPeople >= Global.maxPeopleSelection;
    const isNotAllowRemove = totalPeople <= 1;
    // Local Functions
    const getPeopleControl = () => {
      return (
        <div className={classes.hDivFlex}>
          <div className={classes.hDivPeopleDisplay}>
            <PeopleIcon color='primary' fontSize='default' />
          </div>
          <div className={classes.hDivPeopleDisplay}>{totalPeople}</div>
          <IconButton
            disabled={isNotAllowAdd}
            onClick={() => {
              this.doHandlePeopleChange(1);
            }}
            className={classes.hDivPeopleControl}
          >
            <AddBoxOutlinedIcon color='primary' fontSize='default' />
          </IconButton>
          <IconButton
            disabled={isNotAllowRemove}
            onClick={() => {
              this.doHandlePeopleChange(-1);
            }}
            className={classes.hDivPeopleControl}
          >
            <MinusBoxOutlinedIcon color='primary' fontSize='default' />
          </IconButton>
        </div>
      );
    };
    const getHeader = () => {
      let header = <div />;
      header = (
        <AppBar position='fixed' color='default' className={classes.hAppBar}>
          <Toolbar className={classes.hToolbar}>
            <table style={{width: '100%'}}>
              <tbody>
                <tr>
                  <td>
                    <DateRangeIcon color='primary' fontSize='default' />
                  </td>
                  <td>
                    <div className={classes.hDivFlex}>
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
                      {getPeopleControl()}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <HomeWorkIcon color='primary' fontSize='default' />
                  </td>
                  <td>
                    <LocationSearchInput
                      hints={'Where from?'}
                      fullWidth
                      handleChange={({address, location}) => {
                        this.doHandleAddressChange({
                          address,
                          location,
                          destinations,
                        });
                      }}
                      address={selectedAddress}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
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
          <PopupMessage
            open={popup.open}
            handleClose={this.handlePopupClose}
            title={popup.title}
            message={popup.message}
          />
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
                onClick={() => {
                  this.dohandleBtnStartHoliday(plan);
                }}
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
