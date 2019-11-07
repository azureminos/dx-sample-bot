/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== Module ================================================================
import _ from 'lodash';

// ===== DB ====================================================================

// ===== SOCKET ================================================================
import UserSocket from '../sockets/user-socket';

// ===== MESSENGER =============================================================

// ===== HANDLER ===============================================================
// Create package instance
const create = ({
  request: {senderId, packageId},
  allInRoom,
  sendStatus,
  socket,
  socketUsers,
  userSocket,
}) => {
  console.log('>>>>Received event to create package instance', {
    packageId: packageId,
    senderId: senderId,
  });
  /* InstPackage.addInstPackage(packageId).then((inst) => {
    console.log('>>>>Created package instance', inst);
    // User(owner) join
    UserSocket.join({
      request: {senderId: senderId, instId: inst.id},
      allInRoom,
      sendStatus,
      socket,
      socketUsers,
      userSocket,
    });
  });*/
};

// Create package instance
const view = ({request: {packageId}, sendStatus, userSocket}) => {
  console.log('>>>>Received event to view package', packageId);
  /* Promise.all([
    Pkg.getPackageDetails(packageId),
    Pkg.getCityAttractions(packageId),
    Pkg.getCityHotels(packageId),
  ]).then(([pkg, cityAttractions, cityHotels]) => {
    console.log('>>>>View Package', {pkg, cityAttractions, cityHotels});
    // Dummy Hotels
    if (!pkg.hotels) {
      pkg.hotels = _.uniqBy(pkg.items, 'dayNo').map((day) => {
        return cityHotels[day.city][0].id;
      });
    }

    if (pkg) {
      userSocket.emit('package:view', {
        pkg,
        cityAttractions,
        cityHotels,
      });
    } else {
      console.error("Package doesn't exist!");
      sendStatus('noPackage');
    }
  });*/
};

export default {create, view};
