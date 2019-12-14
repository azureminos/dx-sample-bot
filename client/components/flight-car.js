import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// ====== Icons ======
import FlightTakeoff from '@material-ui/icons/FlightTakeoff';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import HelpIcon from '@material-ui/icons/HelpOutlineRounded';

const styles = (theme) => ({
  flex: {
    display: 'flex',
  },
  icon: {
    paddingTop: 15,
  },
  form: {
    marginTop: 0,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 0,
    minWidth: 110,
  },
});

class FlightCar extends React.Component {
  constructor(props) {
    super(props);

    this.handleCarChange = this.handleCarChange.bind(this);
    this.handleFlightChange = this.handleFlightChange.bind(this);
  }

  handleCarChange(event) {
    this.props.handleSelectCar(event.target.value);
  }

  handleFlightChange(event) {
    this.props.handleSelectFlight(event.target.value);
  }
  render() {
    console.log('>>>>FlightCar, render()', this.props);
    const {
      classes,
      isDisabled,
      departDates,
      carOptions,
      selectedDepartDate,
      selectedReturnDate,
      selectedCarOption,
    } = this.props;
    // Reference
    const isReadonly = carOptions && carOptions.length === 1;
    const miDepartDates = _.map(departDates, (i) => {
      return (
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>
      );
    });
    const miReturnDates = selectedReturnDate ? (
      <MenuItem value={selectedReturnDate}>{selectedReturnDate}</MenuItem>
    ) : (
      ''
    );
    const miCarOptions = carOptions
      ? _.map(carOptions, (i) => {
        return (
            <MenuItem key={i || 0} value={i}>
              {i}
            </MenuItem>
        );
      })
      : [];

    // Web Elements
    const divFlightOptions = (
      <div className={classes.flex}>
        <div className={classes.icon}>
          <FlightTakeoff color='primary' />
        </div>
        <div>
          <FormControl className={classes.form} disabled={isDisabled}>
            <Select
              value={selectedDepartDate || ''}
              onChange={this.handleFlightChange}
              displayEmpty
              inputProps={{
                name: 'departDate',
                id: 'depart-date',
              }}
            >
              <MenuItem value='' disabled>
                <em>Fly Out</em>
              </MenuItem>
              {miDepartDates}
            </Select>
          </FormControl>
          <FormControl className={classes.form}>
            <Select value={selectedReturnDate || ''} displayEmpty disabled>
              <MenuItem value='' disabled>
                <em>Fly Back</em>
              </MenuItem>
              {miReturnDates}
            </Select>
          </FormControl>
        </div>
        <div className={classes.icon}>
          <HelpIcon />
        </div>
      </div>
    );
    const divCarOptions =
      miCarOptions && miCarOptions.length > 1 ? (
        <div className={classes.flex}>
          <div className={classes.icon}>
            <DirectionsCar color='primary' />
          </div>
          <div>
            <FormControl
              className={classes.form}
              disabled={isReadonly || isDisabled}
            >
              <Select
                value={selectedCarOption || ''}
                onChange={this.handleCarChange}
                displayEmpty
                inputProps={{
                  name: 'typeGroundTransport',
                  id: 'typeGroundTransport-simple',
                }}
              >
                <MenuItem value='' disabled>
                  <em>Ground Transport</em>
                </MenuItem>
                {miCarOptions}
              </Select>
            </FormControl>
          </div>
          <div className={classes.icon}>
            <HelpIcon />
          </div>
        </div>
      ) : (
        ''
      );

    return (
      <div className={classes.root}>
        {divFlightOptions}
        {divCarOptions}
      </div>
    );
  }
}

export default withStyles(styles)(FlightCar);
