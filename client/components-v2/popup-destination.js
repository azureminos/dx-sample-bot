import _ from 'lodash';
import React, {createElement} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LocationSearchInput from './location-search-input';
import CONSTANTS from '../../lib/constants';
import Helper from '../../lib/helper';
import {withStyles} from '@material-ui/core/styles';

// Variables
const {Global} = CONSTANTS.get();
const styles = (theme) => ({});

class PopupDestination extends React.Component {
  constructor(props) {
    // console.log('>>>>PopupDestination.constructor', props);
    super(props);
    // Bind handler
    this.doHandleClose = this.doHandleClose.bind(this);
    this.doHandleAddDestination = this.doHandleAddDestination.bind(this);
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
  doHandleAddDestination() {
    console.log('>>>>PopupDestination.doHandleAddDestination', this.state);
  }
  doHandleAddressChange(input) {
    console.log('>>>>PopupDestination.doHandleAddressChange', input);
    const {address, location} = input;
    if (location) {
      fetch('/api/tool/searchAttraction/', {
        method: 'POST',
        body: JSON.stringify({name: address.split(',')[0]}),
        headers: {'Content-Type': 'application/json'},
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('>>>>doHandleAddressChange.matchActivity', json);
          const {destinations} = this.props;
          const closeCity = Helper.findCloseCity(location, destinations);
          if (!closeCity) {
            // Enter a new location
            const error =
              'Please enter a valid address for the destination city';
            this.setState({sAddress: '', sLocation: '', error});
          } else {
            console.log('>>>>test', closeCity);
          }
        });
    } else {
      this.setState({sAddress: address, sLocation: ''});
    }
  }
  // Render web widget
  render() {
    // ====== Local Variables ======
    console.log('>>>>PopupDestination.render', this.props);
    const {open, message, dayNo} = this.props;
    const {error, sLocation, sAddress} = this.state;
    // ====== Local Functions ======
    const getMessage = (msg) => {
      if (msg) {
        return <div>{msg}</div>;
      }
      return '';
    };
    // ====== Web Elements ======
    const btnOk = sLocation ? (
      <Button onClick={this.doHandleAddDestination} color='primary'>
        OK
      </Button>
    ) : (
      ''
    );
    // ====== Display ======
    return (
      <Dialog
        open={open}
        onClose={this.doHandleClose}
        aria-labelledby='alert-dialog-hotel'
      >
        <DialogTitle id='alert-dialog-hotel'>{`Day ${dayNo}: Add Destination`}</DialogTitle>
        <DialogContent>
          <div>
            <div>Please enter the name or address of your destination</div>
            {getMessage(message || error)}
            <LocationSearchInput
              hints={`Day ${dayNo}: Where to visit`}
              fullWidth
              handleChange={this.doHandleAddressChange}
              address={sAddress}
            />
          </div>
        </DialogContent>
        <DialogActions>
          {btnOk}
          <Button onClick={this.doHandleClose} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PopupDestination);
