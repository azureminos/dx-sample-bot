/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */
/* eslint-disable max-len */
// import _ from 'lodash';

/* ============  Local Variables  =============*/
const msgWelcome =
  'Hello, I am XYZ and can assist you with your holiday planning. How may I help you?';
const defaultImageUrl = 'media/tour-1-cover.png';
const homeUrl = (apiUri) => `${apiUri}/`;
const packageUrl = (apiUri, packageId) => `${apiUri}/instance/new/${packageId}`;
const instPackageUrl = (apiUri, instId) => `${apiUri}/instance/${instId}`;
/*
 * BUTTONS
 *
 * Objects and methods that create objects that represent
 * buttons to be used in various UI elements.
 */

/**
 * Button for opening a specific list in a webview
 *
 * @param {string} instPackageUrl - URL for a specific package instance.
 * @param {string} buttonText - Text for the action button.
 * @returns {object} -
 *   Message to create a button pointing to the list in a webview.
 */
const openExistingPackageButton = (
  instPackageUrl,
  buttonText = 'View Details'
) => {
  return {
    type: 'web_url',
    title: buttonText,
    url: instPackageUrl,
    messenger_extensions: true,
    webview_height_ratio: 'full',
    webview_share_button: 'hide',
  };
};

/**
 * Button for opening a new list in a webview
 *
 * @param {string} apiUri - Hostname of the server.
 * @param {string=} buttonTitle - Button title.
 * @returns {object} -
 *   Message to create a button pointing to the new list form.
 */
const createListButton = (apiUri) => {
  return {
    type: 'web_url',
    url: homeUrl(apiUri),
    title: 'View All Packages',
    webview_height_ratio: 'full',
    messenger_extensions: true,
    webview_share_button: 'hide',
  };
};

/*
 * MESSAGES
 *
 * Objects and methods that create objects that represent
 * messages sent to Messenger users.
 */

const packageMessage = (apiUri, packages) => {
  console.log('>>>>Messange.packageMessage', packages);
  const items = packages.map((p) => {
    const urlToPackage = packageUrl(apiUri, p.id);
    console.log(`>>>>Generated URL >> ${urlToPackage}`, p);

    return {
      title: p.name,
      image_url: `${apiUri}/${p.imageUrl || defaultImageUrl}`,
      subtitle: p.description,
      /* default_action: {
        type: 'web_url',
        url: urlToPackage,
        messenger_extensions: true,
        webview_share_button: 'hide',
      },*/
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

/**
 * Message for when the user has no lists yet.
 *
 * @param {string} apiUri - Hostname of the server.
 * @returns {object} - Message with welcome text and a button to start a new list.
 */
const noListsMessage = (apiUri) => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: 'It looks like you don’t have booked any packages yet.',
        buttons: [createListButton(apiUri)],
      },
    },
  };
};

/**
 * Message to configure the customized sharing menu in the webview
 *
 * @param {string} apiUri - Application basename
 * @param {string} listId - The ID for list to be shared
 * @param {string} title - Title of the list
 * @param {string} buttonText - Text for the action button.
 * @returns {object} - Message to configure the customized sharing menu.
 */
const sharePackageMessage = (apiUri, instId, title, description, imageUrl) => {
  console.log('>>>>sharePackageMessage(), start', {
    apiUri: apiUri,
    instId: instId,
    title: title,
    description: description,
    imageUrl: imageUrl,
  });
  const urlToInstPackage = instPackageUrl(apiUri, instId);
  const result = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: title,
            image_url: `${apiUri}/${imageUrl}`,
            subtitle: description,
            buttons: [openExistingPackageButton(urlToInstPackage)],
          },
        ],
      },
    },
  };
  console.log('>>>>sharePackageMessage(), complete', result);
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
  console.log('>>>>quickReplyMessage(), start', {title, items});
  const result = {
    text: title,
    quick_replies: items,
  };
  console.log('>>>>quickReplyMessage(), complete', result);
  return result;
};

/**
 * Message to configure the welcome message via quick reply message
 *
 * @param {string} lastInstanceId - instance id of last updated package
 * @returns {object} - Message to configure the customized sharing menu.
 */
const welcomeMessage = (lastInstanceId) => {
  console.log('>>>>welcomeMessage(), start', lastInstanceId);
  const replyItems = [];

  const iAllPromote = {
    content_type: 'text',
    title: 'Holidays on Sale',
    payload: 'promoted_packages',
  };
  const iMyRecent = {
    content_type: 'text',
    title: 'Recent Update',
    payload: `my_recent@${lastInstanceId}`,
  };
  const iHandOver = {
    content_type: 'text',
    title: 'Live Chat',
    payload: 'handover_thread',
  };

  replyItems.push(iAllPromote);
  if (lastInstanceId) {
    replyItems.push(iMyRecent);
  }
  replyItems.push(iHandOver);

  const result = quickReplyMessage(msgWelcome, replyItems);
  console.log('>>>>welcomeMessage(), complete', result);
  return result;
};

export default {
  packageMessage,
  createListButton,
  noListsMessage,
  sharePackageMessage,
  welcomeMessage,
  quickReplyMessage,
};
