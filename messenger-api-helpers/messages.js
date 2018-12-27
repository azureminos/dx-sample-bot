/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */
/* eslint-disable max-len */
import _ from 'lodash';
import InstPackageItem from '../models/package-instance-item';

/*============URL=============*/
const listUrl = (apiUri, listId) => `${apiUri}/lists/${listId}`;
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
const openExistingPackageButton = (instPackageUrl, buttonText = 'View Package') => {
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
  let items = packages.map((pkg) => {
    const urlToPackage = packageUrl(apiUri, pkg.id);
    
    // Set default package image url
    const defaultImageUrl = 'media/tour-1-cover.png';
    console.log('>>>>Generated URL >> ' + urlToPackage, pkg);

    return {
      title: pkg.name,
      image_url: `${apiUri}/${pkg.imageUrl || defaultImageUrl}`,
      subtitle: pkg.description,
      /*default_action: {
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
        buttons: [
          createListButton(apiUri),
        ],
      },
    },
  };
};

/**
 * Helper to construct a URI for the desired list
 *
 * @param {string} apiUri -
 *   Base URI for the server.
 *   Because this moduele may be called from the front end, we need to pass it explicitely.
 * @param {int} listId - The list ID.
 * @returns {string} - URI for the required list.
 */

/**
 * A single list for the list template.
 * The name here is to distinguish lists and list templates.
 *
 * @param {string} id            - List ID.
 * @param {string} apiUri        - Url of endpoint.
 * @param {string} subscriberIds - Ids of each subscriber.
 * @param {string} title         - List title.
 * @returns {object} - Message with welcome text and a button to start a new list.
 */
const listElement = ({id, subscriberIds, title}, apiUri) => {
  return {
    title: title,
    subtitle: `Shared with ${[...subscriberIds].length} people`,
    default_action: {
      type: 'web_url',
      url: listUrl(apiUri, id),
      messenger_extensions: true,
      webview_height_ratio: 'full',
      webview_share_button: 'hide',
    },
  };
};

/**
 * Messages for a list template of lists (meta!), offset by how many
 * "read mores" the user has been through
 *
 * @param {string} apiUri - Hostname of the server.
 * @param {string} action - The postback action
 * @param {Array.<Object>} lists - All of the lists to be (eventually) displayed.
 * @param {int=} offset - How far through the list we are so far.
 * @returns {object} - Message with welcome text and a button to start a new list.
 */
const paginatedListsMessage = (apiUri, action, lists, offset = 0) => {
  const pageLists = lists.slice(offset, offset + 4);

  let buttons;
  if (lists.length > (offset + 4)) {
    buttons = [
      {
        title: 'View More',
        type: 'postback',
        payload: `${action}_OFFSET_${offset + 4}`,
      },
    ];
  }

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'list',
        top_element_style: 'compact',
        elements: pageLists.map((list) => listElement(list, apiUri)),
        buttons,
      },
    },
  };
};

/**
 * Message that informs the user that their list has been created.
 */
const listCreatedMessage = {
  text: 'Your list was created.',
};

const createDayItinery = (its) => {
  return its.map((i) => {
    return `${i.name}, `;
  });
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
const sharePackageMessage = (apiUri, instId, items) => {
  console.log('>>>>start sharePackageMessage', {apiUri: apiUri, instId: instId, items: items});
  const urlToInstPackage = instPackageUrl(apiUri, instId);
  const dayItems = _.groupBy(items, (i) => {return `Day ${i.dayNo}, ${i.city}`;});
  console.log('>>>>sharePackageMessage(), items grouped by day', dayItems);
  const itinerary = Object.keys(dayItems).map((key) => {
    console.log('>>>>sharePackageMessage(), looping through every day', key);
    const it = dayItems[key];
    return {
      title: `Day ${it[0].dayNo}, ${it[0].city}`,
      image_url: `${apiUri}/${it[0].imageUrl}`,
      subtitle: createDayItinery(it),
      /*default_action: {
        type: 'web_url',
        url: urlToPackage,
        messenger_extensions: true,
        webview_share_button: 'hide',
      },*/
      buttons: [openExistingPackageButton(urlToInstPackage)],
    };
  });

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: itinerary,
      },
    },
  };
};

export default {
  packageMessage,
  listCreatedMessage,
  paginatedListsMessage,
  createListButton,
  noListsMessage,
  sharePackageMessage,
};
