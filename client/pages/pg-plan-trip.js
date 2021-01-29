import _ from 'lodash';
import React, {createElement} from 'react';
import 'react-dates/initialize';
import {DateRangePicker} from 'react-dates';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
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
    this.doHandleAddressChange = this.doHandleAddressChange.bind(this);
    // Init state
    this.state = {
      tabSelected: this.props.daySelected || 0,
      focusedDateInput: null,
      selectedAddress: '',
      selectedLocation: '',
    };
  }
  // Event Handler
  doHandleTabSelect = (event, newValue) => {
    console.log('>>>>PagePlanTrip.doHandleTabSelect', newValue);
    this.setState({tabSelected: newValue});
  };
  doHandleAddressChange = ({address, location}) => {
    console.log('>>>>PagePlanTrip.doHandleAddressChange', {address, location});
    this.setState({selectedAddress: address, selectedLocation: location});
  };
  // Display page
  render() {
    console.log('>>>>PagePlanTrip, render()', this.props);
    const {classes, plan, planExt, reference, actions} = this.props;
    const {tagGroups} = reference;
    const {handleDateRangeChange, handleTagGroupChange} = actions;
    const {startDate, endDate} = plan;
    const {selectedTagGroups} = planExt;
    const {tabSelected, focusedDateInput} = this.state;
    // Local Functions
    const getHeader = (isDateSelected) => {
      let header = <div />;
      let tabs = '';
      if (isDateSelected) {
        const totalDays = endDate.diff(startDate, 'days');
        const tabItems = [<Tab key={0} label='Summary' {...a11yProps(0)} />];
        for (let i = 0; i < totalDays; i++) {
          const day = i + 1;
          tabItems.push(
            <Tab key={day} label={`Day ${day}`} {...a11yProps(day)} />
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
      }
      header = (
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
              <div>
                {isDateSelected ? (
                  <LocationSearchInput
                    handleChange={this.doHandleAddressChange}
                    address={this.state.selectedAddress}
                  />
                ) : (
                  ''
                )}
              </div>
              <div>{isDateSelected ? tabs : ''}</div>
            </div>
          </Toolbar>
        </AppBar>
      );
      return header;
    };

    const getBody = (isDateSelected) => {
      let body = <div />;
      if (isDateSelected) {
        const totalDays = endDate.diff(startDate, 'days');
        const tabPanels = [
          <TabPanel key={0} value={tabSelected} index={0}>
            Trip Summary
          </TabPanel>,
        ];
        for (let i = 0; i < totalDays; i++) {
          const day = i + 1;
          tabPanels.push(
            <TabPanel key={day} value={tabSelected} index={day}>
              Trip Day Details
            </TabPanel>
          );
        }
        body = <div className={classes.bRoot}>{tabPanels}</div>;
      } else {
        const getGridTagGroup = (t) => {
          const isSelected = !!_.find(selectedTagGroups, (g) => {
            return t.name === g;
          });
          return (
            <Grid item xs={4} key={t._id}>
              <div
                onClick={() => {
                  handleTagGroupChange(t.name);
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

        body = (
          <div>
            <div>Pick your interests</div>
            <Grid container spacing={2}>
              {_.map(tagGroups, (t) => {
                return getGridTagGroup(t);
              })}
            </Grid>
          </div>
        );
      }
      return body;
    };
    const getFooter = (isDateSelected) => {
      let footer = <div />;
      if (isDateSelected) {
        footer = (
          <AppBar position='fixed' color='default' className={classes.fAppBar}>
            <Toolbar className={classes.fToolbar}>
              <div>
                <div>Show interests scroll bar</div>
                <div>
                  <Button fullWidth color='primary'>
                    Complete
                  </Button>
                </div>
              </div>
            </Toolbar>
          </AppBar>
        );
      }
      return footer;
    };
    // Local Variables
    const isDateSelected =
      startDate && endDate && endDate.diff(startDate, 'days') > 0;
    // Sub Components
    // Display Widget
    return (
      <div className={classes.root}>
        {getHeader(isDateSelected)}
        <div className={classes.whitespaceTop} />
        {getBody(isDateSelected)}
        <div className={classes.whitespaceBottom} />
        {getFooter(isDateSelected)}
      </div>
    );
  }
}

export default withStyles(styles)(PagePlanTrip);
