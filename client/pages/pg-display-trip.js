import _ from 'lodash';
import React, {createElement} from 'react';
import 'react-dates/initialize';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {withStyles} from '@material-ui/core/styles';
import PackageDayOrganizer from '../components-v2/package-day-organizer';
import PackageSummary from '../components-v2/package-summary';
import PopupHotel from '../components-v2/popup-hotel';
import PopupDestination from '../components-v2/popup-destination';
import Helper from '../../lib/helper';
import CONSTANTS from '../../lib/constants';
// ====== Icons && CSS ======
import DateRangeIcon from '@material-ui/icons/DateRange';
import PeopleIcon from '@material-ui/icons/People';
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
  fButtons: {
    display: 'flex',
  },
  fDivPlan: {
    display: 'flex',
    margin: 'auto',
  },
  fDivPlanItem: {
    margin: 'auto',
    padding: '0px 4px',
  },
  fBtnRoot: {
    width: 80,
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
class PageDisplayTrip extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doHandleTabSelect = this.doHandleTabSelect.bind(this);
    this.handleBtnHotel = this.handleBtnHotel.bind(this);
    this.handleHotelClose = this.handleHotelClose.bind(this);
    this.doHandleUpdateHotel = this.doHandleUpdateHotel.bind(this);
    this.handleBtnDestination = this.handleBtnDestination.bind(this);
    this.handleDestinationClose = this.handleDestinationClose.bind(this);
    this.doHandleUpdateDestination = this.doHandleUpdateDestination.bind(this);
    this.doHandleBtnLeft = this.doHandleBtnLeft.bind(this);
    this.doHandleBtnRight = this.doHandleBtnRight.bind(this);
    this.doHandleBtnGoStart = this.doHandleBtnGoStart.bind(this);

    // Init state
    this.state = {
      popupHotel: {
        open: false,
        message: '',
        dayNo: null,
      },
      popupDest: {
        open: false,
        message: '',
        dayNo: null,
      },
    };
  }
  // Event Handler
  handlePopupClose() {
    // console.log('>>>>PageDisplayTrip.handlePopupClose');
    const popup = {open: false, title: '', message: ''};
    this.setState({popup});
  }
  handleHotelClose() {
    // console.log('>>>>PageStartTrip.handleHotelClose');
    const popupHotel = {open: false, message: '', dayNo: null};
    this.setState({popupHotel});
  }
  handleDestinationClose() {
    // console.log('>>>>PageStartTrip.handleDestinationClose');
    const popupDest = {open: false, message: '', dayNo: null};
    this.setState({popupDest});
  }
  handleBtnHotel(dayNo) {
    const popupHotel = {open: true, message: '', dayNo: dayNo};
    this.setState({popupHotel});
  }
  handleBtnDestination(dayNo) {
    const popupDest = {open: true, message: '', dayNo: dayNo};
    this.setState({popupDest});
  }
  doHandleTabSelect(event, newValue) {
    // console.log('>>>>PageDisplayTrip.doHandleTabSelect', newValue);
    const {actions} = this.props;
    if (actions && actions.handleTabSelect) {
      actions.handleTabSelect(newValue);
    }
  }
  doHandleBtnGoStart() {
    // console.log('>>>>PageDisplayTrip.doHandleBtnGoStart', this.props);
    const {actions} = this.props;
    if (actions && actions.handleBtnGoStart) {
      actions.handleBtnGoStart();
    }
  }
  doHandleBtnLeft() {
    // console.log('>>>>PageDisplayTrip.doHandleBtnLeft', this.props);
    const {tabSelected, actions} = this.props;
    if (tabSelected === 0 && actions && actions.handleBtnGoStart) {
      actions.handleBtnGoStart();
    } else if (actions && actions.handleBtnGoDisplay) {
      actions.handleBtnGoDisplay();
    }
  }
  doHandleBtnRight() {
    // console.log('>>>>PageDisplayTrip.doHandleBtnRight', this.props);
    const {actions, plan, tabSelected} = this.props;
    if (tabSelected === plan.days.length) {
      const error = Helper.validatePlan();
      if (error) {
        const popup = {};
        this.setState({popup});
      } else if (actions && actions.handleBtnGoPayment) {
        actions.handleBtnGoPayment();
      }
    } else if (actions && actions.handleTabSelect) {
      actions.handleTabSelect(tabSelected + 1);
    }
  }
  doHandleUpdateDestination(input) {
    // console.log('>>>>PagePlanTrip.doHandleUpdateDestination', input);
    const popupDest = {open: false, message: '', dayNo: null};
    this.setState({popupDest});
    const {actions} = this.props;
    if (actions && actions.handleSetDestination) {
      actions.handleSetDestination(input);
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
  // Display page
  render() {
    console.log('>>>>PageDisplayTrip, render()', this.props);
    const {classes, reference, actions} = this.props;
    const {tabSelected, plan, planExt} = this.props;
    const {destinations} = reference;
    const {startDate, endDate, totalPeople} = plan;
    const {popupHotel, popupDest} = this.state;
    const strStartDate = '01/Mar/2021';
    const strEndDate = '03/Mar/2021';
    // Local Functions
    const getHeader = () => {
      const tabItems = [<Tab key={0} label='Summary' {...a11yProps(0)} />];
      for (let i = 0; i < plan.totalDays; i++) {
        const dayNo = i + 1;
        tabItems.push(
          <Tab
            key={dayNo}
            disabled={!(plan.days[i].cities && plan.days[i].cities.length > 0)}
            label={`Day ${dayNo}`}
            {...a11yProps(dayNo)}
          />
        );
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
              handleBtnDestination: this.handleBtnDestination,
              handleTabSelect: this.doHandleTabSelect,
            }}
          />
        </TabPanel>,
      ];
      for (let i = 0; i < totalDays; i++) {
        const dayNo = i + 1;
        tabPanels.push(
          <TabPanel key={dayNo} value={tabSelected} index={dayNo}>
            <PackageDayOrganizer
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
          <PopupDestination
            open={popupDest.open}
            message={popupDest.message}
            dayNo={popupDest.dayNo}
            destinations={destinations}
            handleClose={this.handleDestinationClose}
            handleAddDestination={this.doHandleUpdateDestination}
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
                variant='contained'
                color='primary'
                onClick={this.doHandleBtnLeft}
                classes={{root: classes.fBtnRoot, label: classes.fBtnLabel}}
              >
                {tabSelected === 0 ? 'Trip Details' : 'More Activities'}
              </Button>
              <div
                className={classes.fDivPlan}
                onClick={this.doHandleBtnGoStart}
              >
                <div className={classes.fDivPlanItem}>
                  <DateRangeIcon color='primary' fontSize='default' />
                </div>
                <table className={classes.fDivPlanItem}>
                  <tbody>
                    <tr>
                      <td>Start:</td>
                      <td>{strStartDate}</td>
                    </tr>
                    <tr>
                      <td>End:</td>
                      <td>{strEndDate}</td>
                    </tr>
                  </tbody>
                </table>
                <div className={classes.fDivPlanItem}>
                  <PeopleIcon color='primary' fontSize='default' />
                </div>
                <div className={classes.fDivPlanItem}>{totalPeople}</div>
              </div>
              <Button
                color='primary'
                variant='contained'
                onClick={this.doHandleBtnRight}
                classes={{root: classes.fBtnRoot, label: classes.fBtnLabel}}
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

export default withStyles(styles)(PageDisplayTrip);
