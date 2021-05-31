import _ from 'lodash';
import React, {createElement} from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import {PayPalButton} from 'react-paypal-button-v2';
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
  handlePaySuccess(details, data) {
    console.log('paypal integration success', {details, data});
    if (details.status === 'COMPLETED') {
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
    const {handleClose, plan} = this.props;
    console.log('>>>>PopupPayment.render', plan);
    const ppOptions = {
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
        estCost = estCost + (i.totalPrice || 0);
      });
    });
    // ====== Local Functions ======
    // ====== Web Elements ======
    // ====== Display ======
    return (
      <Drawer anchor={'bottom'} open onClose={handleClose}>
        <div>Payment</div>
        <div>
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
            amount={Payment.deposit}
            options={ppOptions}
            buttonStyles={buttonStyles}
            onSuccess={this.handlePaySuccess}
            onError={this.handlePayError}
            onCancel={this.handlePayCancel}
          />
        </div>
        <div>
          <Button
            variant='contained'
            onClick={handleClose}
            color='primary'
            autoFocus
          >
            Close
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PopupPayment);
