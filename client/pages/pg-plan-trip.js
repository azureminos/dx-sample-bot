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
import PopupHotel from '../components-v2/popup-hotel';
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
    height: 60,
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
  bRoot: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 'fit-content',
    width: '100%',
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
  fButtons: {
    display: 'flex',
  },
  fDivPlan: {
    display: 'flex',
    margin: 'auto',
  },
  fBtnLabel: {
    alignItems: 'baseline',
    height: 45,
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
        <Box p={3} style={{padding: '8px'}}>
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
    this.handlePopupClose = this.handlePopupClose.bind(this);
    this.handleBtnHotel = this.handleBtnHotel.bind(this);
    this.handleHotelClose = this.handleHotelClose.bind(this);
    this.doHandleBtnLeft = this.doHandleBtnLeft.bind(this);
    this.doHandleBtnRight = this.doHandleBtnRight.bind(this);
    // Init state
    this.state = {
      focusedDateInput: null,
      selectedAddress: '',
      selectedLocation: '',
      popup: {
        open: false,
        title: '',
        message: '',
      },
      popupHotel: {
        open: false,
        message: '',
        dayNo: null,
      },
    };
  }
  // Event Handler
  handlePopupClose() {
    // console.log('>>>>PagePlanTrip.handlePopupClose');
    const popup = {open: false, title: '', message: ''};
    this.setState({popup});
  }
  handleHotelClose() {
    // console.log('>>>>PageStartTrip.handleHotelClose');
    const popupHotel = {open: false, message: '', dayNo: null};
    this.setState({popupHotel});
  }
  handleBtnHotel(dayNo) {
    const popupHotel = {open: true, message: '', dayNo: dayNo};
    this.setState({popupHotel});
  }
  doHandleTabSelect(event, newValue) {
    // console.log('>>>>PagePlanTrip.doHandleTabSelect', newValue);
    const {actions} = this.props;
    if (actions && actions.handleTabSelect) {
      actions.handleTabSelect(newValue);
    }
  }
  doHandleBtnLeft() {
    // console.log('>>>>PagePlanTrip.doHandleBtnLeft', this.props);
    const {tabSelected, actions} = this.props;
    if (tabSelected === 0 && actions && actions.handleBtnGoStart) {
      actions.handleBtnGoStart();
    } else if (actions && actions.handleBtnGoDisplay) {
      actions.handleBtnGoDisplay();
    }
  }
  doHandleBtnRight() {
    // console.log('>>>>PagePlanTrip.doHandleBtnRight', this.props);
    const {actions} = this.props;
    const error = Helper.validatePlan();
    if (error) {
      const popup = {};
      this.setState({popup});
    } else if (actions && actions.handleBtnGoPayment) {
      actions.handleBtnGoPayment();
    }
  }
  doHandleUpdateHotel(input) {
    // console.log('>>>>PagePlanTrip.doHandleUpdateHotel', input);
    const popupHotel = {open: false, message: '', dayNo: null};
    this.setState({popupHotel});
    const {actions} = this.props;
    if (actions && actions.handleUpdateHotel) {
      actions.handleUpdateHotel(input);
    }
  }
  doHandleAddressChange(input) {
    const {address, location, destinations} = input;
    console.log('>>>>PagePlanTrip.doHandleAddressChange', input);
    if (location) {
      fetch('/api/tool/searchAttraction/', {
        method: 'POST',
        body: JSON.stringify({name: address.split(',')[0]}),
        headers: {'Content-Type': 'application/json'},
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('>>>>doHandleAddressChange.matchActivity', json);
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
            if (address.indexOf(closeCity.name) > -1) {
              this.setState({
                selectedAddress: '',
                selectedLocation: '',
              });
            } else {
              const popup = {
                open: true,
                title: 'Destination city found',
                message: `Destination got updated as the nearest city ${closeCity.name}`,
              };
              this.setState({
                selectedAddress: '',
                selectedLocation: '',
                popup,
              });
            }
            const {actions} = this.props;
            if (actions && actions.handleSetDestination) {
              actions.handleSetDestination({city: closeCity, ...json});
            }
          }
        });
    } else {
      this.setState({selectedAddress: address, selectedLocation: ''});
    }
  }
  // Display page
  render() {
    console.log('>>>>PagePlanTrip, render()', this.props);
    const {classes, tabSelected, reference, actions} = this.props;
    const {plan, planExt} = this.props;
    const {destinations} = reference;
    const {startDate, endDate, totalPeople} = plan;
    const {selectedAddress, popup, popupHotel} = this.state;
    const dateRange = '01/Mar/2021 - 03/Mar/2021';
    // Local Functions
    const getHeader = () => {
      const tabItems = [<Tab key={0} label='Summary' {...a11yProps(0)} />];
      for (let i = 0; i < plan.totalDays; i++) {
        const day = i + 1;
        if (plan.days[i].cities && plan.days[i].cities.length > 0) {
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
          value={tabSelected}
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
          <Toolbar className={classes.hToolbar}>{tabs}</Toolbar>
        </AppBar>
      );
    };

    const getBody = () => {
      const totalDays = endDate.diff(startDate, 'days') + 1;
      const tabPanels = [
        <TabPanel key={0} value={tabSelected} index={0}>
          <PackageSummary
            plan={plan}
            planExt={planExt}
            reference={reference}
            actions={{
              ...actions,
              handleBtnHotel: this.handleBtnHotel,
              handleTabSelect: this.doHandleTabSelect,
            }}
          />
        </TabPanel>,
      ];
      for (let i = 0; i < totalDays; i++) {
        const dayNo = i + 1;
        tabPanels.push(
          <TabPanel key={dayNo} value={tabSelected} index={dayNo}>
            <PackageDayPlanner
              plan={plan}
              planExt={planExt}
              reference={reference}
              actions={actions}
              dayNo={dayNo}
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
          <PopupHotel
            open={popupHotel.open}
            message={popupHotel.message}
            dayNo={popupHotel.dayNo}
            hotel={
              popupHotel.dayNo ? plan.days[popupHotel.dayNo - 1].hotel : null
            }
            handleClose={this.handleHotelClose}
            handleUpdateHotel={this.doHandleUpdateHotel}
          />
        </div>
      );
    };
    const getFooter = () => {
      return (
        <AppBar position='fixed' color='default' className={classes.fAppBar}>
          <Toolbar className={classes.fToolbar}>
            <div className={classes.fButtons}>
              <Button
                color='primary'
                onClick={this.doHandleBtnLeft}
                classes={{label: classes.fBtnLabel}}
              >
                {tabSelected === 0 ? 'Trip Details' : 'Booking Details'}
              </Button>
              <div className={classes.fDivPlan}>
                <div>
                  <DateRangeIcon color='primary' fontSize='default' />
                </div>
                <div>{dateRange}</div>
                <div>
                  <PeopleIcon color='primary' fontSize='default' />
                </div>
                <div>{totalPeople}</div>
              </div>
              <Button
                color='primary'
                onClick={this.doHandleBtnRight}
                classes={{label: classes.fBtnLabel}}
              >
                Pay
              </Button>
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
