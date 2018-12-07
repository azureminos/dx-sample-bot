/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* ----------  External Libraries  ---------- */

import React from 'react';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import _ from 'lodash';
/* ----------  Messenger Helpers  ---------- */

import messages from '../messenger-api-helpers/messages';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
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

    const itineraries = _.groupBy(instPackage.items, (item)=>{
      return item.dayNo;
    });

    _.forEach(_.keys(itineraries), (dayNo) => {
      result += ' ' + dayText(dayNo, itineraries[dayNo][0].city) + '(';
      _.forEach(itineraries[dayNo], (it) => {
        result += (it.name + ', ');
      });
      result += ').';
    });
    console.log('>>>>Invite, formatItinerary', result);
    return result;
  };

  const shareList = () => {
    window.MessengerExtensions.beginShareFlow(
      function success(response) {
        if (response.is_sent) {
          window.MessengerExtensions.requestCloseBrowser(null, null);
        }
      }, function error(errorCode, errorMessage) {
        console.error({errorCode, errorMessage});
      },
      messages.sharePackageMessage(apiUri, instPackage.id, instPackage.name,
        formatItinerary(instPackage), instPackage.imageUrl),
      sharingMode);
  };

  //const iconClassName = sharingMode === 'broadcast' ? 'share' : 'send';

  return (
    <Button
      onClick={shareList}
      variant='contained'
      color='default'
      className={classes.button}
    >
      {buttonText}
      <SendIcon className={classes.leftIcon} />
    </Button>
  );
};

Invite.PropTypes = {
  shareList: React.PropTypes.func.isRequired,
};

export default withStyles(styles)(Invite);
