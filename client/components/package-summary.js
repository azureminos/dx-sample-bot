import _ from 'lodash';
import Moment from 'moment';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import FlightCar from './flight-car';
import packageHelper from '../../lib/package-helper';
import CONSTANTS from '../../lib/constants';
// ====== Icons ======
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
// Variables
const {Global} = CONSTANTS.get();
const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  itinerary: {
    display: 'block',
  },
});

class PackageSummary extends React.Component {
  constructor(props) {
    super(props);
    // Bind event handlers
    this.doHandleSelectFlight = this.doHandleSelectFlight.bind(this);
    // Init data
    const {startDate} = props.transport;
    // Setup state
    this.state = {
      startDate: startDate,
    };
  }
  // Event Handlers
  doHandleSelectFlight(stStartDate) {
    console.log('>>>>PackageSummary.doHandleSelectFlight');
    const {transport, actions} = this.props;
    const sDate = stStartDate
      ? Moment(stStartDate, Global.dateFormat).toDate()
      : null;
    if (actions && actions.handleSelectFlight) {
      const eDate = stStartDate
        ? Moment(stStartDate, Global.dateFormat)
            .add(transport.totalDays, 'days')
            .toDate()
        : null;
      actions.handleSelectFlight(sDate, eDate);
    }
    this.setState({startDate: sDate});
  }
  // Display Widget
  render() {
    const {classes, transport, itineraries, cities} = this.props;
    const {totalDays, departDates, carOption, carOptions} = transport;
    console.log('>>>>PackageSummary, render()', {
      transport,
      itineraries,
      cities,
    });
    // Local Variables
    const labelDays = `${totalDays} Day${totalDays > 1 ? 's' : ''}`;
    const {startDate} = this.state;
    const stStartDate = startDate
      ? Moment(startDate).format(Global.dateFormat)
      : '';
    const stEndDate = startDate
      ? Moment(startDate)
          .add(totalDays, 'days')
          .format(Global.dateFormat)
      : '';
    // Sub Components
    const secFlightCar = (
      <FlightCar
        departDates={departDates}
        selectedDepartDate={stStartDate}
        selectedReturnDate={stEndDate}
        carOptions={carOptions}
        selectedCarOption={carOption}
        handleSelectFlight={this.doHandleSelectFlight}
        handleSelectCar={() => {
          console.log('>>>>FlightCar.handleSelectCar');
        }}
      />
    );
    const divDays = _.map(itineraries, (it) => {
      const labelItinerary = `Day ${it.dayNo}, ${it.cityVisit}`;
      const cityImageUrl = packageHelper.getCityImage(it, cities) || '';
      return (
        <ListItem key={it.dayNo} className={classes.itinerary}>
          <Typography variant='h6' component='h4'>
            {labelItinerary}
          </Typography>
          <GridList cellHeight={160} className={classes.gridList} cols={1}>
            <GridListTile
              cols={1}
              onClick={() => {
                console.log('PackageSummary.DayClicked', it.dayNo);
              }}
            >
              <img src={cityImageUrl} alt={labelItinerary} />
            </GridListTile>
          </GridList>
        </ListItem>
      );
    });
    // Display Widget
    return (
      <List className={classes.root}>
        <ListItem key={'date-selector-1'}>{secFlightCar}</ListItem>
        <Divider />
        <ListItem key={'package-Itinerary'}>
          <ListItemAvatar>
            <Avatar>
              <BeachAccessIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='Itinerary Details' secondary={labelDays} />
        </ListItem>
        {divDays}
        <Divider />
        <ListItem key={'date-selector-2'}>{secFlightCar}</ListItem>
      </List>
    );
  }
}

export default withStyles(styles)(PackageSummary);
