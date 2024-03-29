/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */
/* eslint-disable max-len */
// import _ from 'lodash';
import _ from 'lodash';
import moment from 'moment';
import CONSTANTS from '../lib/constants';
import Model from '../db/schema';
/* ============  Local Variables  =============*/
const {Global, Instance} = CONSTANTS.get();
const msgWelcome =
  'Hello, I am XYZ and can assist you with your holiday planning. How may I help you?';
const packageUrl = (apiUri, userId, packageId) =>
  `${apiUri}/web/${userId}/package/${packageId}`;
const instPackageUrl = (apiUri, userId, instId) =>
  `${apiUri}/web/${userId}/instance/${instId}`;
const urlCreatePlan = (apiUri, userId) => `${apiUri}/web/${userId}/plan/new`;
const urlAllPlan = (apiUri, userId) => `${apiUri}/web/${userId}/plan/all`;
/*
 * BUTTONS
 *
 * Objects and methods that create objects that represent
 * buttons to be used in various UI elements.
 */

/**
 * Button for opening a specific list in a webview
 *
 * @param {string} instanceUrl - URL for a specific package instance.
 * @param {string} buttonText - Text for the action button.
 * @returns {object} -
 *   Message to create a button pointing to the list in a webview.
 */
const openExistingPackageButton = (
  instanceUrl,
  buttonText = 'View Details'
) => {
  console.log('>>>>Messages.openExistingPackageButton', instanceUrl);
  return {
    type: 'web_url',
    title: buttonText,
    url: instanceUrl,
    messenger_extensions: true,
    webview_height_ratio: 'full',
    webview_share_button: 'hide',
  };
};

/*
 * MESSAGES
 *
 * Objects and methods that create objects that represent
 * messages sent to Messenger users.
 */

const packageMessage = (apiUri, userId, packages) => {
  console.log('>>>>Message.packageMessage', packages);
  const items = packages.map((p) => {
    const urlToPackage = packageUrl(apiUri, userId, p.id);

    return {
      title: p.name,
      image_url: p.imageUrl,
      subtitle: p.description,
      buttons: [openExistingPackageButton(urlToPackage)],
    };
  });

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: items,
      },
    },
  };
};

const packageShareMessage = {
  text:
    'To share the package, simply forward the item below to your friends in Messenger.',
};
/**
 * Message to configure the customized sharing menu in the webview
 *
 * @param {string} apiUri - Application basename
 * @param {string} instId - The ID for instance to be shared
 * @param {string} title - Title of the list
 * @param {string} description - Description of the instance
 * @param {string} imageUrl - Image url.
 * @returns {object} - Message to configure the customized sharing menu.
 */
const sharePackageMessage = (
  apiUri,
  userId,
  instId,
  title,
  description,
  imageUrl
) => {
  console.log('>>>>sharePackageMessage, start', {
    apiUri: apiUri,
    userId: userId,
    instId: instId,
    title: title,
    description: description,
    imageUrl: imageUrl,
  });
  const urlToInstPackage = instPackageUrl(apiUri, userId, instId);
  const result = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: title,
            image_url: imageUrl,
            subtitle: description,
            buttons: [openExistingPackageButton(urlToInstPackage)],
          },
        ],
      },
    },
  };
  console.log('>>>>sharePackageMessage, complete', result);
  return result;
};

/**
 * Message to configure the quick reply message
 *
 * @param {string} title - Title of the list
 * @param {object} items - array of quick reply items.
 * @returns {object} - Message to configure the customized sharing menu.
 */
const quickReplyMessage = (title, items) => {
  console.log('>>>>quickReplyMessage, start', {title, items});
  const result = {
    text: title,
    quick_replies: items,
  };
  console.log('>>>>quickReplyMessage, complete', result);
  return result;
};

/**
 * Message to configure the welcome message via quick reply message
 *
 * @param {string} lastInstanceId - instance id of last updated package
 * @returns {object} - Message to configure the customized sharing menu.
 */
const welcomeMessage = (plans) => {
  console.log('>>>>welcomeMessage, start', plans);
  const planInit = _.filter(plans, (p) => {
    return p.status === Instance.status.INITIATED;
  });
  const planDepo = _.filter(plans, (p) => {
    return p.status === Instance.status.DEPOSIT_PAID;
  });
  const replyItems = [];

  const iAllPromote = {
    content_type: 'text',
    title: 'New travel plan',
    payload: 'new_plan',
  };
  const iMyRecent =
    planInit && planInit.length > 0
      ? {
        content_type: 'text',
        title: 'Existing travel plans',
        payload: 'existing_plan',
      }
      : null;
  const iDepoPaid =
    planDepo && planDepo.length > 0
      ? {
        content_type: 'text',
        title: 'Finalize paid plans',
        payload: 'deposit_paid',
      }
      : null;
  const iHandOver = {
    content_type: 'text',
    title: 'Live Chat',
    payload: 'handover_thread',
  };

  replyItems.push(iAllPromote);
  if (iMyRecent) {
    replyItems.push(iMyRecent);
  }
  if (iDepoPaid) {
    replyItems.push(iDepoPaid);
  }
  replyItems.push(iHandOver);

  const result = quickReplyMessage(msgWelcome, replyItems);
  console.log('>>>>welcomeMessage, complete', result);
  return result;
};
// ===================== New Bot ==================== //
const messageCreatePlan = (apiUri, userId) => {
  console.log('>>>>Message.messageCreatePlan', userId);
  const result = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: 'Travel Plan',
            image_url: Global.defaultImgUrl,
            subtitle: '',
            buttons: [
              {
                type: 'web_url',
                title: 'New',
                url: urlCreatePlan(apiUri, userId),
                messenger_extensions: true,
                webview_height_ratio: 'full',
                webview_share_button: 'hide',
              },
            ],
          },
        ],
      },
    },
  };
  return result;
};

const messageAllPlan = (apiUri, userId) => {
  console.log('>>>>Message.messageAllPlan', userId);
  const result = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: 'Recent Travel Plans',
            image_url: Global.defaultImgUrl,
            subtitle: '',
            buttons: [
              {
                type: 'web_url',
                title: 'Open',
                url: urlAllPlan(apiUri, userId),
                messenger_extensions: true,
                webview_height_ratio: 'full',
                webview_share_button: 'hide',
              },
            ],
          },
        ],
      },
    },
  };
  return result;
};

const depositPaidMessage = (plans) => {
  console.log('>>>>Message.depositPaidMessage', plans);
  const elements = _.map(plans, (p) => {
    const startDate = moment(p.startDate);
    const endDate = moment(p.endDate);
    const dtStart = startDate.format('DD/MM/YYYY');
    const totalDays = endDate.diff(startDate, 'days') + 1;
    const dtUpdated = moment(p.updatedAt).format('DD/MM/YYYY HH:mm');
    return {
      title: `Deposit Paid on ${dtUpdated}`,
      image_url: Global.defaultImgUrl,
      subtitle: `Leaving ${p.startCity.name} on ${dtStart}, Total ${totalDays} Days`,
      buttons: [
        {
          type: 'postback',
          title: 'Finalise Booking',
          payload: `FB##${p._id}`,
        },
      ],
    };
  });
  const result = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: elements,
      },
    },
  };
  return result;
};

const planDayMessage = (plan) => {
  console.log('>>>>Message.planDayMessage', plan);
  const elements = _.map(plan.days, (d) => {
    const getCities = (cities) => {
      const cs = _.map(cities, (c) => {
        return c.name;
      });
      return _.join(cs, ' > ');
    };
    const buttons = _.map(d.items, (it) => {
      return {
        type: 'postback',
        title: it.name,
        payload: `FBT##${it._id}`,
      };
    });
    const day = {
      title: `Day ${d.dayNo}`,
      image_url: Global.defaultImgUrl,
      subtitle: getCities(d.cities),
      buttons: buttons,
    };
    return day;
  });
  const result = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: elements,
      },
    },
  };
  return result;
};

export default {
  welcomeMessage,
  quickReplyMessage,
  packageMessage,
  depositPaidMessage,
  planDayMessage,
  sharePackageMessage,
  packageShareMessage,
  messageCreatePlan,
  messageAllPlan,
};
