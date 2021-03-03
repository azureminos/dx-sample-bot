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
  if (!plan._id) {
    // create full record in DB for Plan, PlanDay and PlanDayItem
    const resp = {};
    const oPlan = {
      status: plan.status,
      startDate: plan.startDate,
      endDate: plan.endDate,
      startCity: plan.startCity,
      endCity: plan.endCity,
      totalPeople: plan.totalPeople,
      createdAt: new Date(),
      createdBy: senderId,
      updatedAt: new Date(),
      updatedBy: senderId,
    };
    Model.createPlan(oPlan, (err, tmpPlan) => {
      // console.log('>>>>Model.createPlan Saved', {err, tmpPlan});
      if (err) {
        console.error('>>>>Model.createPlan Failed', {err, oPlan});
        return;
      }
      plan._id = tmpPlan._id;
      resp._id = tmpPlan._id;
      resp.days = [];
      const oDays = _.map(plan.days, (d) => {
        return {
          travelPlan: plan._id,
          dayNo: d.dayNo,
          cities: d.cities,
          hotel: d.hotel,
          createdAt: new Date(),
          createdBy: senderId,
          updatedAt: new Date(),
          updatedBy: senderId,
        };
      });
      Model.createPlanDay(oDays, (err, tmpDays) => {
        // console.log('>>>>Model.createPlan Saved', {err, tmpDays});
        if (err) {
          console.error('>>>>Model.createPlanDay Failed', {err, oDays});
          return;
        }
        const oItems = [];
        for (let i = 0; i < plan.days.length; i++) {
          const matcher = _.find(tmpDays, (td) => {
            return td.dayNo === plan.days[i].dayNo;
          });
          if (matcher) {
            plan.days[i]._id = matcher._id;
            resp.days.push({_id: matcher._id, dayNo: matcher.dayNo, items: []});
            _.each(plan.days[i].items, (it, idx) => {
              oItems.push({
                travelPlan: plan._id,
                travelPlanDay: plan.days[i]._id,
                daySeq: idx,
                itemType: it.itemType,
                itemId: it.itemId,
                totalPeople: it.totalPeople,
                unitPrice: it.unitPrice,
                createdAt: new Date(),
                createdBy: senderId,
                updatedAt: new Date(),
                updatedBy: senderId,
              });
            });
          }
        }
        if (oItems && oItems.length > 0) {
          Model.createPlanDayItem(oItems, (err, tmpItems) => {
            console.log('>>>>Model.createPlanDayItem Saved', {err, tmpItems});
            if (err) {
              console.error('>>>>Model.createPlanDayItem Failed', {
                err,
                oItems,
              });
              return;
            }
            // Update object id and send updated object back
            socket.emit('plan:save', resp);
          });
        } else {
          // Send updated object back
          socket.emit('plan:save', resp);
        }
      });
    });
  } else {
    // only update Plan in DB
  }
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
    if (err) {
      console.log('>>>>Error.Model.getFilteredPackages', err);
    } else {
      console.log('>>>>Model.getFilteredPackages result', docs);
      socket.emit('package:showAll', docs);
    }
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
