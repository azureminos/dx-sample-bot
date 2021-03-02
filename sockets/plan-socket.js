/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== Module ================================================================
import _ from 'lodash';
import async from 'async';
import CONSTANTS from '../lib/constants';
import PackageHelper from '../lib/package-helper';
// ===== DB ====================================================================
import Model from '../db/schema';
// ===== SOCKET ================================================================
import UserSocket from './user-socket';
// ===== MESSENGER =============================================================
import sendApi from '../messenger-api-helpers/send';

// Variables
const {Global, Instance, SocketChannel, TravelPackage} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const SocketAction = SocketChannel.Action;
const SocketStatus = SocketChannel.Status;
const PackageStatus = TravelPackage.status;

// ===== HANDLER ===============================================================
const savePlan = (input) => {
  const {request, sendStatus, socket, socketUsers} = input;
  console.log('>>>>Socket.savePlan', {request, socketUsers});
  const {plan, senderId} = request;
};

const savePlanDay = (input) => {
  const {request, sendStatus, socket, socketUsers} = input;
  console.log('>>>>Socket.savePlanDay', {request, socketUsers});
  const {packageId, totalDays, carOption, senderId} = request;
};

const listAllPlan = (input) => {
  const {request, allInRoom, sendStatus, socket, socketUsers} = input;
  console.log('>>>>Socket.showAllPlans', {request, socketUsers});
  const params = {isSnapshot: true, status: PackageStatus.PUBLISHED};
  Model.getFilteredPackages(params, (err, docs) => {
    if (err) console.log('>>>>Error.Model.getFilteredPackages', err);
    console.log('>>>>Model.getFilteredPackages result', docs);
    socket.emit('package:showAll', docs);
  });
};

const loadPlan = (input) => {
  const {request, allInRoom, sendStatus, socket, socketUsers} = input;
  console.log('>>>>Socket.loadPlan', {request, socketUsers});
  const {senderId, packageId} = request;
};

export default {
  savePlan,
  savePlanDay,
  listAllPlan,
  loadPlan,
};
