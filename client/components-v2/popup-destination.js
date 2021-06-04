import _ from 'lodash';
import React, {createElement} from 'react';
import Drawer from '@material-ui/core/Drawer';
import LocationSearchInput from './location-search-input';
import Helper from '../../lib/helper';
import {withStyles} from '@material-ui/core/styles';

// Variables
const styles = (theme) => ({
  drawerBody: {
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    padding: '8px 8px 40px 8px',
  },
});

class PopupDestination extends React.Component {
  constructor(props) {
    // console.log('>>>>PopupDestination.constructor', props);
    super(props);
    // Bind handler
    this.doHandleClose = this.doHandleClose.bind(this);
    this.doHandleAddressChange = this.doHandleAddressChange.bind(this);
    // Set initial state
    this.state = {
      sAddress: '',
      sLocation: '',
      error: '',
    };
  }
  // ====== Event Handler ======
  doHandleClose() {
    // console.log('>>>>PopupDestination.doHandleClose');
    this.setState({error: '', sAddress: '', sLocation: '', sAddressType: ''});
    if (this.props.handleClose) {
      this.props.handleClose();
    }
  }
  doHandleAddressChange(input) {
    console.log('>>>>PopupDestination.doHandleAddressChange', input);
    const {dayNo, handleAddDestination} = this.props;
    const {address, location, type} = input;
    if (location) {
      const {destinations} = this.props;
      const closeCity = Helper.findCloseCity(location, destinations);
      if (!closeCity) {
        // Option 1: Enter a new location
        /* const error = 'Please enter a valid address for the destination city';
        this.setState({sAddress: '', sLocation: '', error});*/
        // Option 2: allow but show no activities
        this.setState({
          sAddress: address,
          sLocation: location,
          error: '',
        });
        if (handleAddDestination) {
          const {country} = this.props.planExt;
          const oCity = Helper.getCityFromAddress(type, address, country);
          const tmpCity = {
            destinationId: -1,
            distance: -1,
            location: location,
            name: oCity.name,
            state: oCity.state,
          };
          handleAddDestination({dayNo, city: tmpCity});
        }
      } else {
        this.setState({
          sAddress: address,
          sLocation: location,
          error: '',
        });
        fetch('/api/tool/searchAttraction/', {
          method: 'POST',
          body: JSON.stringify({name: address.split(',')[0]}),
          headers: {'Content-Type': 'application/json'},
        })
          .then((response) => response.json())
          .then((json) => {
            console.log('>>>>doHandleAddressChange.matchActivity', json);
            if (handleAddDestination) {
              handleAddDestination({dayNo, city: closeCity, ...json});
            }
          });
      }
    } else {
      this.setState({sAddress: address, sLocation: ''});
    }
  }
  // Render web widget
  render() {
    // ====== Local Variables ======
    console.log('>>>>PopupDestination.render', this.props);
    const {classes, message, dayNo} = this.props;
    const {error, sAddress} = this.state;
    // ====== Local Functions ======
    const getMessage = (msg) => {
      if (msg) {
        return <div>{msg}</div>;
      }
      return '';
    };
    // ====== Web Elements ======
    // ====== Display ======
    return (
      <Drawer
        anchor={'bottom'}
        open
        onClose={this.doHandleClose}
        classes={{paper: classes.drawerBody}}
      >
        <div
          style={{fontSize: 'x-large', fontWeight: 'bold'}}
        >{`Day ${dayNo}: Add Destination`}</div>
        <div>
          <div style={{padding: '8px 0'}}>
            Please enter the name or address of your destination
          </div>
          {getMessage(message || error)}
          <LocationSearchInput
            hints={`Day ${dayNo}: Where to visit`}
            fullWidth
            handleChange={this.doHandleAddressChange}
            address={sAddress}
          />
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PopupDestination);
