import React, {createElement} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import SendIcon from '@material-ui/icons/Send';
import PaymentIcon from '@material-ui/icons/Payment';
import _ from 'lodash';

/* ----------  Messenger Helpers  ---------- */
import messages from '../messenger-api-helpers/messages';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    paddingRight: theme.spacing.unit,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

/*
 * Button to invite firends by invoking the share menu
 */
const Invite = ({
  instPackage,
  apiUri,
  sharingMode,
  buttonText,
  classes,
}) => {
  console.log('>>>>Start Invite', {instPackage: instPackage, apiUri: apiUri});
  const dayText = (dayNo, city) => `Day ${dayNo}, ${city}`;
  const formatItinerary = (instPackage) => {
    let result = instPackage.description;

    const itineraries = _.groupBy(instPackage.items, (item) => {
      return item.dayNo;
    });

    _.forEach(_.keys(itineraries), (dayNo) => {
      result += ' ' + dayText(dayNo, itineraries[dayNo][0].city) + '(';
      _.forEach(itineraries[dayNo], (it) => {
        result += (it.name + ', ');
      });
      result += ').';
    });
    console.log('>>>>Invite, formatItinerary()', result);
    return result;
  };

  const shareList = () => {
    window.MessengerExtensions.beginShareFlow(
      function success(response) {
        if (response.is_sent) {
          window.MessengerExtensions.requestCloseBrowser(null, null);
        }
      },
      function error(errorCode, errorMessage) {
        console.error({errorCode, errorMessage});
      },
      messages.sharePackageMessage(apiUri, instPackage.id, instPackage.items),
      sharingMode);
  };

  // const iconClassName = sharingMode === 'broadcast' ? 'share' : 'send';

  return (
    <AppBar position='fixed' color='default' className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Button
          onClick={shareList}
          variant='contained'
          color='primary'
          fullWidth='true'
          className={classes.button}
        >
          <div className={classes.leftIcon}>{buttonText}</div>
          <SendIcon/>
        </Button>
        <Button
          variant='contained'
          color='primary'
          fullWidth='true'
          className={classes.button}
        >
          <div className={classes.leftIcon}>Pay Deposit</div>
          <PaymentIcon/>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

Invite.PropTypes = {
  shareList: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(Invite);
