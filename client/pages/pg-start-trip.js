import _ from 'lodash';
import React, {createElement} from 'react';
import 'react-dates/initialize';
import {DateRangePicker} from 'react-dates';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import {withStyles} from '@material-ui/core/styles';
import LocationSearchInput from '../components-v2/location-search-input';
import PopupMessage from '../components-v2/popup-message';
import Helper from '../../lib/helper';
import CONSTANTS from '../../lib/constants';
// ====== Icons && CSS ======
import LocationIcon from '@material-ui/icons/LocationOn';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ChildIcon from '@material-ui/icons/ChildCare';
import AdultIcon from '@material-ui/icons/Mood';
import AddBoxIcon from '@material-ui/icons/AddBoxOutlined';
import MinusBoxIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import 'react-dates/lib/css/_datepicker.css';

// Variables
const {Global} = CONSTANTS.get();
const styles = (theme) => ({
  root: {
    height: '100%',
  },
  whitespaceTop: {
    height: 90,
  },
  whitespaceBottom: {
    height: 70,
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
  hDivFlex1: {
    display: 'flex',
    margin: 'auto',
    padding: '0px 8px',
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
  bGridListRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    margin: '0px 8px',
  },
  bGridListDiv: {
    width: 500,
  },
  bGridItemTitle: {
    borderRadius: '12px',
  },
  bGridItemTitleBarC1: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  bGridItemTitleBarC2: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
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
  fBtnLabel: {
    alignItems: 'baseline',
    height: 45,
  },
});

// Functions
// Class
class PageStartTrip extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doHandleBtnStartHoliday = this.doHandleBtnStartHoliday.bind(this);
    this.doHandleAddressChange = this.doHandleAddressChange.bind(this);
    this.doHandleDateRangeChange = this.doHandleDateRangeChange.bind(this);
    this.doHandleTagGroupChange = this.doHandleTagGroupChange.bind(this);
    this.doHandleAdultChange = this.doHandleAdultChange.bind(this);
    this.doHandleKidChange = this.doHandleKidChange.bind(this);
    this.handlePopupClose = this.handlePopupClose.bind(this);
    this.togglePeopleDrawer = this.togglePeopleDrawer.bind(this);
    // Init state
    this.state = {
      openPeopleDrawer: false,
      focusedDateInput: null,
      selectedAddress: '',
      selectedLocation: '',
      popup: {
        open: false,
        title: '',
        message: '',
      },
    };
  }
  // Event Handler
  togglePeopleDrawer(open) {
    this.setState({openPeopleDrawer: open});
  }
  handlePopupClose() {
    // console.log('>>>>PageStartTrip.handlePopupClose');
    const popup = {open: false, title: '', message: ''};
    this.setState({popup});
  }
  doHandleBtnStartHoliday(plan) {
    // console.log('>>>>PageStartTrip.doHandleBtnStartHoliday', plan);
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
  doHandleAddressChange(input) {
    // console.log('>>>>PageStartTrip.doHandleAddressChange', input);
    const {address, location, destinations} = input;
    if (location) {
      const closeCity = Helper.findCloseCity(location, destinations);
      // console.log('>>>>PageStartTrip.doHandleAddressChange rs', closeCity);
      if (!closeCity) {
        // Enter a new location
        const popup = {
          open: true,
          title: 'Home city not found',
          message: 'Please enter a valid address for the home city',
        };
        this.setState({selectedAddress: '', selectedLocation: '', popup});
      } else {
        if (address.indexOf(closeCity.name) > -1) {
          this.setState({
            selectedAddress: address,
            selectedLocation: location,
          });
        } else {
          const popup = {
            open: true,
            title: 'Home city found',
            message: `Home got updated as the nearest city ${closeCity.name}`,
          };
          this.setState({
            selectedAddress: address,
            selectedLocation: location,
            popup,
          });
        }
        const {actions} = this.props;
        if (actions && actions.handleSetStartCity) {
          actions.handleSetStartCity(closeCity);
        }
      }
    } else {
      this.setState({selectedAddress: address, selectedLocation: ''});
    }
  }
  doHandleDateRangeChange(input) {
    // console.log('>>>>PageStartTrip.doHandleDateRangeChange', input);
    const {actions} = this.props;
    if (actions && actions.handleDateRangeChange) {
      actions.handleDateRangeChange(input);
    }
  }
  doHandleAdultChange(input) {
    const {actions} = this.props;
    if (actions && actions.handlePeopleChange) {
      actions.handlePeopleChange(input, 0);
    }
  }
  doHandleKidChange(input) {
    const {actions} = this.props;
    if (actions && actions.handlePeopleChange) {
      actions.handlePeopleChange(0, input);
    }
  }
  doHandleTagGroupChange(name) {
    // console.log('>>>>PageStartTrip.doHandleTagGroupChange', name);
    const {actions} = this.props;
    if (actions && actions.handleTagGroupChange) {
      actions.handleTagGroupChange(name);
    }
  }
  // Display page
  render() {
    // console.log('>>>>PageStartTrip, render()', this.props);
    const {classes, plan, planExt, reference} = this.props;
    const {tagGroups, destinations} = reference;
    const {startDate, endDate, totalAdults, totalKids} = plan;
    const {selectedTagGroups} = planExt;
    const {focusedDateInput, openPeopleDrawer, popup} = this.state;
    let selectedAddress = this.state.selectedAddress;
    if (!selectedAddress && plan.startCity && plan.startCity.name) {
      selectedAddress = `${plan.startCity.name}, ${plan.startCity.state}`;
    }
    const btnStart = plan._id ? 'Continue' : 'Start My Holiday';
    // Local Functions
    const getPeopleControl = () => {
      return (
        <div className={classes.hDivFlex}>
          <div
            className={classes.hDivFlex1}
            onClick={() => {
              this.togglePeopleDrawer(true);
            }}
          >
            <div className={classes.hDivPeopleDisplay}>
              <AdultIcon color='primary' fontSize='default' />
            </div>
            <div className={classes.hDivPeopleDisplay}>{totalAdults || 0}</div>
          </div>
          <div
            className={classes.hDivFlex1}
            onClick={() => {
              this.togglePeopleDrawer(true);
            }}
          >
            <div className={classes.hDivPeopleDisplay}>
              <ChildIcon color='primary' fontSize='default' />
            </div>
            <div className={classes.hDivPeopleDisplay}>{totalKids || 0}</div>
          </div>
        </div>
      );
    };
    const getHeader = () => {
      return (
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
                    <LocationIcon color='primary' fontSize='default' />
                  </td>
                  <td>
                    <LocationSearchInput
                      hints={'Where from?'}
                      fullWidth
                      handleChange={(input) => {
                        this.doHandleAddressChange({...input, destinations});
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
    };

    const getBody = () => {
      const getGridTagGroup = (t) => {
        const isSelected = !!_.find(selectedTagGroups, (g) => {
          return t.name === g;
        });
        return (
          <GridListTile
            key={t._id}
            classes={{tile: classes.bGridItemTitle}}
            onClick={() => {
              this.doHandleTagGroupChange(t.name);
            }}
          >
            <img src={t.imgUrl || Global.defaultImgUrl} alt={t.name} />
            <GridListTileBar
              titlePosition='top'
              actionIcon={
                <IconButton aria-label={`star ${t.name}`}>
                  {isSelected ? (
                    <StarIcon style={{color: 'yellow'}} />
                  ) : (
                    <StarBorderIcon style={{color: 'white'}} />
                  )}
                </IconButton>
              }
              actionPosition='right'
              className={classes.bGridItemTitleBarC1}
            />
            <GridListTileBar
              title={t.name}
              titlePosition='bottom'
              className={classes.bGridItemTitleBarC2}
            />
          </GridListTile>
        );
      };

      const body = (
        <div>
          <div className={classes.bGridListRoot}>
            <GridList
              cellHeight={200}
              spacing={8}
              className={classes.bGridListDiv}
            >
              {_.map(tagGroups, (t) => {
                return getGridTagGroup(t);
              })}
            </GridList>
          </div>
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
    const getFooter = () => {
      return (
        <AppBar position='fixed' color='default' className={classes.fAppBar}>
          <Toolbar className={classes.fToolbar}>
            <Button
              fullWidth
              color='primary'
              variant='contained'
              classes={{label: classes.fBtnLabel}}
              onClick={() => {
                this.doHandleBtnStartHoliday(plan);
              }}
            >
              {btnStart}
            </Button>
          </Toolbar>
        </AppBar>
      );
    };
    const getDrawerPeople = () => {
      const isAdultDisabled = !totalAdults || totalAdults <= 1;
      const isKidDisabled = !totalKids || totalKids <= 0;
      return (
        <Drawer
          anchor={'bottom'}
          open
          onClose={() => {
            this.togglePeopleDrawer(false);
          }}
        >
          <div>
            <div style={{fontSize: 'x-large', padding: '8px'}}>Travellers</div>
            <table style={{width: '100%'}}>
              <tbody>
                <tr>
                  <td style={{width: '20%', textAlign: 'center'}}>
                    <AdultIcon color='primary' fontSize='default' />
                  </td>
                  <td style={{width: '30%', textAlign: 'left'}}>Adults</td>
                  <td style={{width: '20%', textAlign: 'right'}}>
                    <IconButton
                      onClick={() => {
                        this.doHandleAdultChange(1);
                      }}
                      className={classes.hDivPeopleControl}
                    >
                      <AddBoxIcon color='primary' fontSize='default' />
                    </IconButton>
                  </td>
                  <td style={{width: '10%', textAlign: 'center'}}>
                    {totalAdults || 0}
                  </td>
                  <td style={{width: '20%', textAlign: 'left'}}>
                    <IconButton
                      disabled={isAdultDisabled}
                      onClick={() => {
                        this.doHandleAdultChange(-1);
                      }}
                      className={classes.hDivPeopleControl}
                    >
                      <MinusBoxIcon
                        color={isAdultDisabled ? 'grey' : 'primary'}
                        fontSize='default'
                      />
                    </IconButton>
                  </td>
                </tr>
                <tr>
                  <td style={{width: '20%', textAlign: 'center'}}>
                    <ChildIcon color='primary' fontSize='default' />
                  </td>
                  <td style={{width: '30%', textAlign: 'left'}}>Kids</td>
                  <td style={{width: '20%', textAlign: 'right'}}>
                    <IconButton
                      onClick={() => {
                        this.doHandleKidChange(1);
                      }}
                      className={classes.hDivPeopleControl}
                    >
                      <AddBoxIcon color='primary' fontSize='default' />
                    </IconButton>
                  </td>
                  <td style={{width: '10%', textAlign: 'center'}}>
                    {totalKids || 0}
                  </td>
                  <td style={{width: '20%', textAlign: 'left'}}>
                    <IconButton
                      disabled={isKidDisabled}
                      onClick={() => {
                        this.doHandleKidChange(-1);
                      }}
                      className={classes.hDivPeopleControl}
                    >
                      <MinusBoxIcon
                        color={isKidDisabled ? 'grey' : 'primary'}
                        fontSize='default'
                      />
                    </IconButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Drawer>
      );
    };
    // Local Variables
    const isDateSelected =
      plan.startCity &&
      startDate &&
      endDate &&
      endDate.diff(startDate, 'days') >= 0;
    // Sub Components
    // Display Widget
    return (
      <div className={classes.root}>
        {getHeader()}
        <div className={classes.whitespaceTop} />
        {getBody()}
        {isDateSelected ? <div className={classes.whitespaceBottom} /> : ''}
        {isDateSelected ? getFooter() : ''}
        {openPeopleDrawer ? getDrawerPeople() : ''}
      </div>
    );
  }
}

export default withStyles(styles)(PageStartTrip);
