import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Typography, Grid, Modal, Button, Checkbox} from '@material-ui/core';
// import { PayPalButton } from 'react-paypal-button-v2';
import PaypalButton from './paypal-button';
import CONSTANTS from '../../lib/constants';

// Vairables
const ModalConst = CONSTANTS.get().Modal;
const InstStatus = CONSTANTS.get().Instance.status;
const Payment = {
  envPaypal: process.env.PAYPAL_ENV,
  sandbox: process.env.PAYPAL_DUMMY_ID,
  production: process.env.PAYPAL_ID,
  terms: process.env.TERMS_CONDS,
  currency: process.env.DEF_CURRENCY,
  deposit: process.env.DEF_DEPOSIT,
};
const styles = (theme) => ({
  paper: {
    position: 'relative',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  headerContainer: {
    padding: 8,
  },
  bodyContainer: {
    padding: 8,
  },
  bodyContent: {
    display: 'contents',
  },
  footerContainer: {
    display: 'contents',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    width: '100%',
  },
  terms: {
    display: 'flex',
    alignItems: 'flex-start',
    cursor: 'pointer',
    marginTop: 8,
  },
});

const format = (input, replacements) => {
  const keys = _.keys(replacements);
  _.each(keys, (k) => {
    input = input.replace(k, replacements[k]);
  });
  return input;
};

class BotModal extends React.Component {
  constructor(props) {
    console.log('>>>>BotModal.constructor', props);
    super(props);
    // Set initial state
    this.state = {
      isTermsAgreed: false,
    };
  }
  render() {
    const {isTermsAgreed} = this.state;
    const {classes, modal, actions, reference} = this.props;

    // Event Handler
    const checkTermsHandler = (e) => {
      console.log('>>>>ProductPayment Terms updated', e);
      e.preventDefault();
      this.setState({isTermsAgreed: !this.state.isTermsAgreed});
    };
    // Sub Components
    const secModal = {};
    if (modal === ModalConst.LESS_THAN_MIN.key) {
      const replacements = {'#Min#': reference.min};
      const pBtnModal = [
        {
          title: ModalConst.button.CLOSE,
          handleClick: actions.handleModalClose,
        },
      ];
      secModal.title = format(ModalConst.LESS_THAN_MIN.title, replacements);
      secModal.description = ModalConst.LESS_THAN_MIN.description;
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.ZERO_OWNER.key) {
      const replacements = {'#Min#': reference.min};
      const pBtnModal = [
        {
          title: ModalConst.button.CLOSE,
          handleClick: actions.handleModalClose,
        },
      ];
      secModal.title = format(ModalConst.ZERO_OWNER.title, replacements);
      secModal.description = ModalConst.ZERO_OWNER.description;
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.ENABLE_DIY.key) {
      const pBtnModal = [
        {title: ModalConst.button.YES, handleClick: actions.enablePackageDiy},
        {title: ModalConst.button.NO, handleClick: actions.handleModalClose},
      ];
      secModal.title = ModalConst.ENABLE_DIY.title;
      secModal.description = ModalConst.ENABLE_DIY.description;
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.INVALID_DATE.key) {
      const pBtnModal = [
        {title: ModalConst.button.OK, handleClick: actions.handleModalClose},
      ];
      secModal.title = ModalConst.INVALID_DATE.title;
      secModal.description = ModalConst.INVALID_DATE.description;
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.SUBMIT_PAYMENT.key) {
      // Local Variables, DXTODO
      const CLIENT = {
        sandbox: Payment.sandbox,
        production: Payment.production,
      };
      const {dtStart, dtEnd, people, rooms, rate} = reference;
      // Event Handlers
      const onSuccess = (outcome) => {
        console.log('paypal integration success', outcome);
        if (outcome.status === 'COMPLETED') {
          const result = {
            status:
              Payment.deposit > 0
                ? InstStatus.DEPOSIT_PAID
                : InstStatus.FULLY_PAID,
          };
          actions.handlePayment(result);
        }
      };
      const onError = (error) => {
        console.log('Erroneous payment OR failed to load script!', error);
      };
      const onCancel = (data) => {
        console.log('Cancelled payment!', data);
      };
      // Sub Components
      const divTime = (
        <tr key='time'>
          <td key='time.title'>
            <b>Fly Out / Fly Back</b>
          </td>
          <td key='time.value'>
            {`${dtStart.toLocaleDateString()} / ${dtEnd.toLocaleDateString()}`}
          </td>
        </tr>
      );
      const divPeople = (
        <tr key='people'>
          <td key='people.title'>
            <b>Total Travellers</b>
          </td>
          <td key='people.value'>{people}</td>
        </tr>
      );
      const divRooms = (
        <tr key='rooms'>
          <td key='rooms.title'>
            <b>Total Rooms</b>
          </td>
          <td key='rooms.value'>{rooms}</td>
        </tr>
      );
      const divRate = (
        <tr key='rate'>
          <td key='rate.title'>
            <b>Package Rate</b>
          </td>
          <td key='rate.value'>{rate}</td>
        </tr>
      );
      /* const divTotal = (
        <tr>
          <td>
            <b>Total Price</b>
          </td>
          <td>{totalRate}</td>
        </tr>
      );*/
      const divDeposit = Payment.deposit ? (
        <tr key='deposit'>
          <td key='deposit.title'>
            <b>Deposit</b>
          </td>
          <td key='deposit.value'>{Payment.deposit}</td>
        </tr>
      ) : (
        ''
      );
      const divTerms = (
        <div>
          <label onClick={checkTermsHandler} className={classes.terms}>
            <Checkbox checked={isTermsAgreed} color='primary' />
            <div style={{paddingTop: 12}}>{Payment.terms}</div>
          </label>
        </div>
      );
      /* const divPayment = isTermsAgreed ? (
        <Button>Paypal</Button>
      ) : (
        <div className={classes.panelBody}>
          <p style={{color: 'red'}}>
            <b>
              In order to proceed with the payment, please read the terms and
              conditions, then tick the checkbox above.
            </b>
          </p>
        </div>
      );*/
      const divPayment = isTermsAgreed ? (
        <PaypalButton
          client={CLIENT}
          env={Payment.envPaypal}
          commit
          currency={Payment.currency}
          total={Payment.deposit}
          onSuccess={onSuccess}
          onError={onError}
          onCancel={onCancel}
        />
      ) : (
        <div className={classes.panelBody}>
          <p style={{color: 'red'}}>
            <b>
              In order to proceed with the payment, please read the terms and
              conditions, then tick the checkbox above.
            </b>
          </p>
        </div>
      );
      const pBtnModal = [
        {
          title: ModalConst.button.CLOSE,
          handleClick: actions.handleModalClose,
        },
      ];
      secModal.title = ModalConst.SUBMIT_PAYMENT.title;
      secModal.description = ModalConst.SUBMIT_PAYMENT.description;
      secModal.buttons = pBtnModal;
      secModal.contents = (
        <Grid container className={classes.bodyContent}>
          <table>
            <tbody>
              {divTime}
              {divPeople}
              {divRooms}
              {divRate}
              {divDeposit}
            </tbody>
          </table>
          {divTerms}
          {divPayment}
        </Grid>
      );
    } else if (modal === ModalConst.DELETE_ITINERARY.key) {
      const dayNo = `Day ${reference.dayNo || ''}`;
      const replacements = {
        '#Day#': dayNo,
      };
      const pBtnModal = [
        {
          title: ModalConst.button.YES,
          handleClick: actions.handleDeleteItinerary,
        },
        {title: ModalConst.button.NO, handleClick: actions.handleModalClose},
      ];
      secModal.title = format(ModalConst.DELETE_ITINERARY.title, replacements);
      secModal.description = format(
        ModalConst.DELETE_ITINERARY.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.FAILED_DELETE_ITINERARY.key) {
      const dayNo = `Day ${reference.dayNo || ''}`;
      const aList = _.filter(reference.attractions, (it) => {
        return it.isRequired;
      });
      const attractions = _.map(aList, (a) => {
        return a.name;
      });
      const replacements = {
        '#Day#': dayNo,
        '#Attractions#': attractions.toString(),
      };
      const pBtnModal = [
        {title: ModalConst.button.OK, handleClick: actions.handleModalClose},
      ];
      secModal.title = format(
        ModalConst.FAILED_DELETE_ITINERARY.title,
        replacements
      );
      secModal.description = format(
        ModalConst.FAILED_DELETE_ITINERARY.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.ADD_ITINERARY.key) {
      const dayNo = `Day ${reference.dayNo || ''}`;
      const replacements = {
        '#Day#': dayNo,
      };
      const pBtnModal = [
        {
          title: ModalConst.button.YES,
          handleClick: actions.handleAddItinerary,
        },
        {title: ModalConst.button.NO, handleClick: actions.handleModalClose},
      ];
      secModal.title = format(ModalConst.ADD_ITINERARY.title, replacements);
      secModal.description = format(
        ModalConst.ADD_ITINERARY.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.FULL_ITINERARY.key) {
      const dayNo = `Day ${reference.dayNo || ''}`;
      const replacements = {
        '#Day#': dayNo,
      };
      const pBtnModal = [
        {title: ModalConst.button.OK, handleClick: actions.handleModalClose},
      ];
      secModal.title = format(ModalConst.FULL_ITINERARY.title, replacements);
      secModal.description = format(
        ModalConst.FULL_ITINERARY.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.ONLY_ITINERARY.key) {
      const dayNo = `Day ${reference.dayNo || ''}`;
      const replacements = {
        '#Day#': dayNo,
      };
      const pBtnModal = [
        {title: ModalConst.button.OK, handleClick: actions.handleModalClose},
      ];
      secModal.title = format(ModalConst.ONLY_ITINERARY.title, replacements);
      secModal.description = format(
        ModalConst.ONLY_ITINERARY.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.INVALID_MAX_PARTICIPANT.key) {
      const max = reference.max || 0;
      const replacements = {
        '#Max#': max,
      };
      const pBtnModal = [
        {title: ModalConst.button.OK, handleClick: actions.handleModalClose},
      ];
      secModal.title = ModalConst.INVALID_MAX_PARTICIPANT.title;
      secModal.description = format(
        ModalConst.INVALID_MAX_PARTICIPANT.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.INVALID_MIN_PARTICIPANT.key) {
      const min = reference.min || 0;
      const replacements = {
        '#Min#': min,
      };
      const pBtnModal = [
        {title: ModalConst.button.OK, handleClick: actions.handleModalClose},
      ];
      secModal.title = ModalConst.INVALID_MIN_PARTICIPANT.title;
      secModal.description = format(
        ModalConst.INVALID_MIN_PARTICIPANT.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    }
    // Sub Components
    const dButtons = _.map(secModal.buttons, (b) => {
      return (
        <Grid item xs>
          <Button
            key={b.title}
            onClick={() => {
              b.handleClick();
            }}
            className={classes.button}
          >
            {b.title}
          </Button>
        </Grid>
      );
    });
    // Display Widget
    return (
      <div>
        <Modal open={!!modal} onClose={() => actions.handleModalClose()}>
          <div className={classes.paper}>
            <Typography
              variant='h6'
              id='modal-title'
              className={classes.headerContainer}
            >
              {secModal.title}
            </Typography>
            <div className={classes.bodyContainer}>
              <Typography variant='subtitle1' id='simple-modal-description'>
                {secModal.description}
              </Typography>
              {secModal.contents ? secModal.contents : ''}
            </div>
            <Grid container className={classes.footerContainer}>
              {dButtons}
            </Grid>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(BotModal);
