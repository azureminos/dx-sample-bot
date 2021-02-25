import _ from 'lodash';
import React, {createElement} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LocationSearchInput from '../components-v2/location-search-input';
import {withStyles} from '@material-ui/core/styles';

// Variables
const styles = (theme) => ({});

class PopupHotel extends React.Component {
  constructor(props) {
    console.log('>>>>PopupHotel.constructor', props);
    super(props);
    // Bind handler
    this.doHandleClose = this.doHandleClose.bind(this);
    this.doHandleUpdateHotel = this.doHandleUpdateHotel.bind(this);
    this.doHandleAddressChange = this.doHandleAddressChange.bind(this);
    // Set initial state
    this.state = {
      sAddress: '',
      sLocation: '',
      sAddressType: '',
    };
  }
  // ====== Event Handler ======
  doHandleClose() {
    // console.log('>>>>PopupHotel.doHandleClose');
    this.setState({sAddress: '', sLocation: '', sAddressType: ''});
    if (this.props.handleClose) {
      this.props.handleClose();
    }
  }
  doHandleUpdateHotel() {
    console.log('>>>>PopupHotel.doHandleUpdateHotel', this.state);
    const {sAddress, sLocation, sAddressType} = this.state;
    if (this.props.handleUpdateHotel) {
      this.props.handleUpdateHotel({
        address: sAddress,
        type: sAddressType,
        location: sLocation,
        dayNo: this.props.dayNo,
      });
    }
  }
  doHandleAddressChange(input) {
    console.log('>>>>PopupHotel.doHandleAddressChange', input);
    const {address, location, type} = input;
    if (location && type !== 'locality') {
      this.setState({
        sAddress: address,
        sLocation: location,
        sAddressType: type,
      });
    } else {
      this.setState({sAddress: address, sLocation: '', sAddressType: ''});
    }
  }
  // Render web widget
  render() {
    // ====== Local Variables ======
    console.log('>>>>PopupHotel.render', this.props);
    const {classes, open, message, hotel} = this.props;
    const hotelAddress = hotel ? hotel.address : '';
    const sAddress = this.state.sAddress || hotelAddress;
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
      <Dialog
        open={open}
        onClose={this.doHandleClose}
        aria-labelledby='alert-dialog-hotel'
      >
        <DialogTitle id='alert-dialog-hotel'>Add/Update Hotel</DialogTitle>
        <DialogContent>
          <div>
            <div>Please enter your hotel name or address</div>
            {getMessage(message)}
            <LocationSearchInput
              hints={'Where to stay?'}
              fullWidth
              handleChange={this.doHandleAddressChange}
              address={sAddress}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.doHandleUpdateHotel} color='primary'>
            OK
          </Button>
          <Button onClick={this.doHandleClose} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PopupHotel);
