import _ from 'lodash';
import React, {createElement} from 'react';
import 'react-dates/initialize';
import {DateRangePicker} from 'react-dates';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {withStyles} from '@material-ui/core/styles';
import PackageDayOrganizer from '../components-v2/package-day-organizer';
import Helper from '../../lib/helper';
import CONSTANTS from '../../lib/constants';
// ====== Icons && CSS ======
import PlaceIcon from '@material-ui/icons/Place';
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
  fBtnLabel: {
    alignItems: 'baseline',
    height: 45,
  },
  fButtons: {
    display: 'flex',
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
class PageDisplayTrip extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doHandleTabSelect = this.doHandleTabSelect.bind(this);
    this.doHandleBtnComplete = this.doHandleBtnComplete.bind(this);
    this.doHandleBtnBackPlanner = this.doHandleBtnBackPlanner.bind(this);
    // Init state
    this.state = {
      tabSelected: 0,
    };
  }
  // Event Handler
  doHandleTabSelect(event, newValue) {
    // console.log('>>>>PageDisplayTrip.doHandleTabSelect', newValue);
    this.setState({tabSelected: newValue});
  }
  doHandleBtnComplete() {
    // console.log('>>>>PageDisplayTrip.doHandleBtnComplete', this.props);
    const {actions} = this.props;
    if (actions && actions.handleBtnComplete) {
      actions.handleBtnComplete();
    }
  }
  doHandleBtnBackPlanner() {
    // console.log('>>>>PageDisplayTrip.doHandleBtnBackPlanner', input);
    const {actions} = this.props;
    if (actions && actions.handleBtnBackPlanner) {
      actions.handleBtnBackPlanner();
    }
  }
  // Display page
  render() {
    console.log('>>>>PageDisplayTrip, render()', this.props);
    const {classes, reference, actions} = this.props;
    const {plan, planExt, hasBtnBack, dayNo} = this.props;
    const {destinations} = reference;
    const {startDate, endDate, totalPeople} = plan;

    // Local Functions
    const getPeopleControl = () => {
      return (
        <div className={classes.hDivFlex}>
          <div className={classes.hDivPeopleDisplay}>
            <PeopleIcon color='primary' fontSize='default' />
          </div>
          <div className={classes.hDivPeopleDisplay}>{totalPeople}</div>
        </div>
      );
    };
    const getHeader = () => {
      const tabItems = [];
      for (let i = 0; i < plan.totalDays; i++) {
        const dayNo = i + 1;
        tabItems.push(
          <Tab
            key={dayNo}
            disabled={plan.days[i].cities && plan.days[i].cities.length > 0}
            label={`Day ${dayNo}`}
            {...a11yProps(dayNo)}
          />
        );
      }
      const tabs = (
        <Tabs
          variant='scrollable'
          value={dayNo || this.state.tabSelected}
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
                        readOnly
                        onDatesChange={() => {}}
                        onFocusChange={() => {}}
                      />
                      {getPeopleControl()}
                    </div>
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
      const tabPanels = [];
      for (let i = 0; i < totalDays; i++) {
        const dayNo = i + 1;
        tabPanels.push(
          <TabPanel key={dayNo} value={this.state.tabSelected} index={i}>
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
      return <div className={classes.bRoot}>{tabPanels}</div>;
    };
    const getFooter = () => {
      return (
        <AppBar position='fixed' color='default' className={classes.fAppBar}>
          <Toolbar className={classes.fToolbar}>
            <div className={classes.fButtons}>
              {hasBtnBack ? (
                <Button
                  fullWidth
                  color='primary'
                  onClick={this.doHandleBtnBackPlanner}
                  classes={{label: classes.fBtnLabel}}
                >
                  Back
                </Button>
              ) : (
                ''
              )}
              <Button
                fullWidth
                color='primary'
                onClick={this.doHandleBtnComplete}
                classes={{label: classes.fBtnLabel}}
              >
                Complete
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
