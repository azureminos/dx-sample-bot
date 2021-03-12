import _ from 'lodash';
import React, {createElement} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withStyles} from '@material-ui/core/styles';
import {PayPalButton} from 'react-paypal-button';
import CONSTANTS from '../../lib/constants';

// Variables
const styles = (theme) => ({});
const {Payment, Instance} = CONSTANTS.get();

class PopupPayment extends React.Component {
  constructor(props) {
    console.log('>>>>PopupPayment.constructor', props);
    super(props);
    // Bind handler
    this.handlePaySuccess = this.handlePaySuccess.bind(this);
    this.handlePayError = this.handlePayError.bind(this);
    this.handlePayCancel = this.handlePayCancel.bind(this);
    // Set initial state
  }
  // ====== Event Handler ======
  handlePaySuccess(outcome) {
    console.log('paypal integration success', outcome);
    if (outcome.status === 'COMPLETED') {
      const result = {
        status: Instance.status.DEPOSIT_PAID,
      };
      if (this.props.handlePayment) {
        this.props.handlePayment(result);
      }
    }
  }
  handlePayError(error) {
    console.log('Erroneous payment OR failed to load script!', error);
  }
  handlePayCancel(data) {
    console.log('Cancelled payment!', data);
  }
  // Render web widget
  render() {
    // ====== Local Variables ======
    const {open, handleClose, plan} = this.props;
    console.log('>>>>PopupPayment.render', {open, plan});
    const paypalOptions = {
      clientId:
        Payment.env === 'production' ? Payment.production : Payment.sandbox,
      currency: Payment.currency,
    };
    const buttonStyles = {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'checkout',
    };
    let estCost = 0;
    const dtStart = plan.startDate.format('DD/MM/YYYY');
    const dtEnd = plan.endDate.format('DD/MM/YYYY');
    _.each(plan.days, (d) => {
      _.each(d.items, (i) => {
        estCost = estCost + i.unitPrice * i.totalPeople;
      });
    });
    // ====== Local Functions ======
    // ====== Web Elements ======
    // ====== Display ======
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Payment</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <table>
              <tbody>
                <tr>
                  <td>
                    <b>Trip Dates</b>
                  </td>
                  <td>{`${dtStart} - ${dtEnd}`}</td>
                </tr>
                <tr>
                  <td>
                    <b>Total People</b>
                  </td>
                  <td>{plan.totalPeople}</td>
                </tr>
                <tr>
                  <td>
                    <b>Estimated Cost</b>
                  </td>
                  <td>{estCost}</td>
                </tr>
                <tr>
                  <td>
                    <b>Initial Deposit</b>
                  </td>
                  <td>{Payment.deposit}</td>
                </tr>
              </tbody>
            </table>
            <PayPalButton
              paypalOptions={paypalOptions}
              buttonStyles={buttonStyles}
              amount={Payment.deposit}
              onPaymentSuccess={this.handlePaySuccess}
              onPaymentError={this.handlePayError}
              onPaymentCancel={this.handlePayCancel}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary' autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PopupPayment);
