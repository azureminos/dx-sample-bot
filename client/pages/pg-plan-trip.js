import _ from 'lodash';
import React, {createElement} from 'react';
import 'react-dates/initialize';
import {DateRangePicker} from 'react-dates';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {withStyles} from '@material-ui/core/styles';
import LocationSearchInput from '../components-v2/location-search-input';
import PopupMessage from '../components-v2/popup-message';
import PackageSummary from '../components-v2/package-summary';
import PackageDayPlanner from '../components-v2/package-day-planner';
import Helper from '../../lib/helper';
import CONSTANTS from '../../lib/constants';
// ====== Icons && CSS ======
import PlaceIcon from '@material-ui/icons/Place';
import DateRangeIcon from '@material-ui/icons/DateRange';
import PeopleIcon from '@material-ui/icons/People';
import AddBoxIcon from '@material-ui/icons/AddBoxOutlined';
import MinusBoxIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import 'react-dates/lib/css/_datepicker.css';

// Variables
const {Global} = CONSTANTS.get();
const styles = (theme) => ({
  root: {
    height: '100%',
  },
  whitespaceTop: {
    height: 120,
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
function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{width: '100%'}}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}
class PagePlanTrip extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doHandleTabSelect = this.doHandleTabSelect.bind(this);
    this.doHandleAddressChange = this.doHandleAddressChange.bind(this);
    this.doHandleDateRangeChange = this.doHandleDateRangeChange.bind(this);
    this.doHandlePeopleChange = this.doHandlePeopleChange.bind(this);
    this.handlePopupClose = this.handlePopupClose.bind(this);
    // Init state
    this.state = {
      tabSelected: 0,
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
  handlePopupClose() {
    // console.log('>>>>PagePlanTrip.handlePopupClose');
    const popup = {open: false, title: '', message: ''};
    this.setState({popup});
  }
  handleBtnComplete() {
    // e.preventDefault();
    // this.setState({openModal: true});
  }
  doHandleTabSelect = (event, newValue) => {
    // console.log('>>>>PagePlanTrip.doHandleTabSelect', newValue);
    this.setState({tabSelected: newValue});
  };
  doHandleAddressChange = (input) => {
    const {address, location, destinations} = input;
    console.log('>>>>PagePlanTrip.doHandleAddressChange', input);
    if (location) {
      const closeCity = Helper.findCloseCity(location, destinations);
      if (!closeCity) {
        // Enter a new location
        const popup = {
          open: true,
          title: 'Destination city not found',
          message: 'Please enter a valid address for the destination city',
        };
        this.setState({selectedAddress: '', selectedLocation: '', popup});
      } else {
        const strCity = `${closeCity.name} ${closeCity.state}`;
        const popup = {
          open: true,
          title: 'Destination city found',
          message: `Destination got updated as the nearest city ${strCity}`,
        };
        this.setState({
          selectedAddress: '',
          selectedLocation: '',
          popup,
        });
        const {actions} = this.props;
        if (actions && actions.handleSetDestination) {
          actions.handleSetDestination(closeCity);
        }
      }
    } else {
      this.setState({selectedAddress: address, selectedLocation: ''});
    }
  };
  doHandleDateRangeChange(input) {
    // console.log('>>>>PagePlanTrip.doHandleDateRangeChange', input);
    const {actions} = this.props;
    if (actions && actions.handleDateRangeChange) {
      actions.handleDateRangeChange(input);
    }
  }
  doHandlePeopleChange(input) {
    // console.log('>>>>PagePlanTrip.doHandlePeopleChange', input);
    const {actions} = this.props;
    if (actions && actions.handlePeopleChange) {
      actions.handlePeopleChange(input);
    }
  }
  // Display page
  render() {
    console.log('>>>>PagePlanTrip, render()', this.props);
    const {classes, plan, planExt, reference, actions} = this.props;
    const {tagGroups, destinations} = reference;
    const {startDate, endDate, totalPeople} = plan;
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
            <AddBoxIcon color='primary' fontSize='default' />
          </IconButton>
          <IconButton
            disabled={isNotAllowRemove}
            onClick={() => {
              this.doHandlePeopleChange(-1);
            }}
            className={classes.hDivPeopleControl}
          >
            <MinusBoxIcon color='primary' fontSize='default' />
          </IconButton>
        </div>
      );
    };
    const getHeader = () => {
      const tabItems = [<Tab key={0} label='Summary' {...a11yProps(0)} />];
      for (let i = 0; i < plan.totalDays; i++) {
        const day = i + 1;
        if (plan.days[i].startCity && plan.days[i].endCity) {
          tabItems.push(
            <Tab key={day} label={`Day ${day}`} {...a11yProps(day)} />
          );
        } else {
          tabItems.push(
            <Tab key={day} disabled label={`Day ${day}`} {...a11yProps(day)} />
          );
        }
      }
      const tabs = (
        <Tabs
          variant='scrollable'
          value={this.state.tabSelected}
          indicatorColor='primary'
          textColor='primary'
          variant='scrollable'
          scrollButtons='auto'
          onChange={this.doHandleTabSelect}
          aria-label='trip plan tabs'
        >
          >{tabItems}
        </Tabs>
      );

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
                    <PlaceIcon color='primary' fontSize='default' />
                  </td>
                  <td>
                    <LocationSearchInput
                      hints={'Where to?'}
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
            {tabs}
          </Toolbar>
        </AppBar>
      );
    };

    const getBody = () => {
      const totalDays = endDate.diff(startDate, 'days') + 1;
      const tabPanels = [
        <TabPanel key={0} value={this.state.tabSelected} index={0}>
          <PackageSummary
            plan={plan}
            planExt={planExt}
            reference={reference}
            actions={actions}
          />
        </TabPanel>,
      ];
      for (let i = 0; i < totalDays; i++) {
        const day = i + 1;
        tabPanels.push(
          <TabPanel key={day} value={this.state.tabSelected} index={day}>
            <PackageDayPlanner
              plan={plan}
              planExt={planExt}
              reference={reference}
              actions={actions}
              daySelected={day}
            />
          </TabPanel>
        );
      }
      return (
        <div className={classes.bRoot}>
          {tabPanels}
          <PopupMessage
            open={popup.open}
            handleClose={this.handlePopupClose}
            title={popup.title}
            message={popup.message}
          />
        </div>
      );
    };
    const getFooter = () => {
      return (
        <AppBar position='fixed' color='default' className={classes.fAppBar}>
          <Toolbar className={classes.fToolbar}>
            <div>
              <div>Show interests scroll bar</div>
              <div>
                <Button
                  fullWidth
                  color='primary'
                  onClick={this.handleBtnComplete}
                >
                  Complete
                </Button>
              </div>
            </div>
          </Toolbar>
        </AppBar>
      );
    };
    // Local Variables
    // Sub Components
    // Display Widget
    return (
      <div className={classes.root}>
        {getHeader()}
        <div className={classes.whitespaceTop} />
        {getBody()}
        <div className={classes.whitespaceBottom} />
        {getFooter()}
      </div>
    );
  }
}

export default withStyles(styles)(PagePlanTrip);
