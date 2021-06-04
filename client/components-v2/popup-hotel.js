import _ from 'lodash';
import React, {createElement} from 'react';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LocationSearchInput from '../components-v2/location-search-input';
import CONSTANTS from '../../lib/constants';
import {withStyles} from '@material-ui/core/styles';

// Variables
const {Global} = CONSTANTS.get();
const styles = (theme) => ({
  drawerBody: {
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    padding: '8px 8px 40px 8px',
  },
});

class PopupHotel extends React.Component {
  constructor(props) {
    // console.log('>>>>PopupHotel.constructor', props);
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
      error: '',
    };
  }
  // ====== Event Handler ======
  doHandleClose() {
    // console.log('>>>>PopupHotel.doHandleClose');
    this.setState({error: '', sAddress: '', sLocation: '', sAddressType: ''});
    if (this.props.handleClose) {
      this.props.handleClose();
    }
  }
  doHandleUpdateHotel() {
    // console.log('>>>>PopupHotel.doHandleUpdateHotel', this.state);
    const {sAddress, sLocation, sAddressType} = this.state;
    this.setState({error: '', sAddress: '', sLocation: '', sAddressType: ''});
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
    // console.log('>>>>PopupHotel.doHandleAddressChange', input);
    const {address, location, type} = input;
    if (location) {
      if (type !== Global.ADDR_TYPE_LOCALT) {
        this.setState({
          error: '',
          sAddress: address,
          sLocation: location,
          sAddressType: type,
        });
      } else {
        const error = 'Invalid address or hotel name';
        this.setState({
          error: error,
          sAddress: '',
          sLocation: '',
          sAddressType: '',
        });
      }
    } else {
      this.setState({
        error: '',
        sAddress: address,
        sLocation: '',
        sAddressType: '',
      });
    }
  }
  // Render web widget
  render() {
    // ====== Local Variables ======
    console.log('>>>>PopupHotel.render', this.props);
    const {classes, message, hotel} = this.props;
    const {error, sLocation} = this.state;
    const hotelAddress = hotel
      ? `${hotel.name || ''}${hotel.name ? ', ' : ''}${hotel.address}`
      : '';
    const sAddress = this.state.sAddress || hotelAddress;
    // ====== Local Functions ======
    const getMessage = (msg) => {
      if (msg) {
        return <div>{msg}</div>;
      }
      return '';
    };
    // ====== Web Elements ======
    const btnOk = sLocation ? (
      <Button
        variant='contained'
        onClick={this.doHandleUpdateHotel}
        color='primary'
        style={{width: '100%'}}
      >
        OK
      </Button>
    ) : (
      ''
    );
    // ====== Display ======
    return (
      <Drawer
        anchor={'bottom'}
        open
        onClose={this.doHandleClose}
        classes={{paper: classes.drawerBody}}
      >
        <div style={{fontSize: 'x-large', fontWeight: 'bold'}}>
          Add/Update Hotel
        </div>
        <div>
          <div style={{padding: '8px 0'}}>
            Please enter your hotel name or address
          </div>
          {getMessage(message || error)}
          <LocationSearchInput
            hints={'Where to stay?'}
            fullWidth
            handleChange={this.doHandleAddressChange}
            address={sAddress}
          />
        </div>
        <div style={{display: 'flex'}}>
          {btnOk}
          <Button
            variant='contained'
            onClick={this.doHandleClose}
            color='primary'
            style={{width: '100%'}}
          >
            Close
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PopupHotel);
