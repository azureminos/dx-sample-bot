import _ from 'lodash';
import React, {createElement} from 'react';
import 'react-dates/initialize';
import {DateRangePicker} from 'react-dates';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {withStyles} from '@material-ui/core/styles';
import {VERTICAL_ORIENTATION} from 'react-dates/constants';
import LocationSearchInput from '../components-v2/location-search-input';
// ====== Icons && CSS ======
import SearchIcon from '@material-ui/icons/Search';
import 'react-dates/lib/css/_datepicker.css';

// Variables
const styles = (theme) => ({
  root: {
    height: '100%',
  },
  whitespaceTop: {
    height: 50,
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
  bRoot: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
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
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
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
    // Init state
    this.state = {
      tabSelected: this.props.daySelected || 0,
      focusedDateInput: null,
    };
  }
  // Event Handler
  doHandleTabSelect = (event, newValue) => {
    console.log('>>>>PagePlanTrip.doHandleTabSelect', newValue);
    this.setState({tabSelected: newValue});
  };
  // Display page
  render() {
    console.log('>>>>PagePlanTrip, render()', this.props);
    const {classes, plan, actions} = this.props;
    const {handleDateRangeChange} = actions;
    const {startDate, endDate} = plan;
    const {tabSelected, focusedDateInput} = this.state;
    // Local Variables
    // Sub Components
    let body = <div />;
    let tabs = '';
    const isDateSelected =
      startDate && endDate && endDate.diff(startDate, 'days') > 0;
    if (isDateSelected) {
      const totalDays = endDate.diff(startDate, 'days');
      const tabItems = [<Tab key={0} label='Summary' {...a11yProps(0)} />];
      const tabPanels = [
        <TabPanel key={0} value={tabSelected} index={0}>
          Trip Summary
        </TabPanel>,
      ];
      for (let i = 0; i < totalDays; i++) {
        const day = i + 1;
        tabItems.push(
          <Tab key={day} label={`Day ${day}`} {...a11yProps(day)} />
        );
        tabPanels.push(
          <TabPanel key={day} value={tabSelected} index={day}>
            Trip Day Details
          </TabPanel>
        );
      }
      tabs = (
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
      body = <div className={classes.bRoot}>{tabPanels}</div>;
    } else {
      body = <div>Pick your interests</div>;
    }

    // Display Widget
    return (
      <div className={classes.root}>
        <AppBar position='fixed' color='default' className={classes.hAppBar}>
          <Toolbar className={classes.hToolbar}>
            <div>
              <div className={classes.hDatePicker}>
                <label>Trip Date</label>
                <DateRangePicker
                  startDate={startDate}
                  startDateId='trip_start_date_id'
                  endDate={endDate}
                  endDateId='trip_end_date_id'
                  numberOfMonths={1}
                  small
                  showClearDates
                  reopenPickerOnClearDates
                  onDatesChange={handleDateRangeChange}
                  focusedInput={focusedDateInput}
                  onFocusChange={(focusedInput) =>
                    this.setState({focusedDateInput: focusedInput})
                  }
                />
              </div>
              <div>{isDateSelected ? <LocationSearchInput /> : ''}</div>
              <div>{isDateSelected ? tabs : ''}</div>
            </div>
          </Toolbar>
        </AppBar>
        <div className={classes.whitespaceTop} />
        {body}
        <div className={classes.whitespaceBottom} />
        <AppBar position='fixed' color='default' className={classes.fAppBar}>
          <Toolbar className={classes.fToolbar}>
            <Button fullWidth color='primary'>
              Complete
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(PagePlanTrip);
