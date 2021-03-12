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
const {Instance, SocketChannel, TravelPackage} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const SocketAction = SocketChannel.Action;
const SocketStatus = SocketChannel.Status;
const PackageStatus = TravelPackage.status;

// ===== HANDLER ===============================================================
const savePlan = (input) => {
  const {request, sendStatus, socket, socketUsers} = input;
  // console.log('>>>>Socket.savePlan', {request, socketUsers});
  const {plan, senderId} = request;
  // console.log('>>>>Socket.savePlan Days', plan.days);
  if (!plan._id) {
    // create full record in DB for Plan, PlanDay and PlanDayItem
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
      // console.log('>>>>Model.createPlanDay', oDays);
      Model.createPlanDay(oDays, (err, tmpDays) => {
        if (err) {
          console.error('>>>>Model.createPlanDay Failed', {err, oDays});
          return;
        }
        // console.log('>>>>Model.createPlanDay Saved', {err, tmpDays});
        const oItems = [];
        for (let i = 0; i < plan.days.length; i++) {
          const matcher = _.find(tmpDays, (td) => {
            return td.dayNo === plan.days[i].dayNo;
          });
          if (matcher) {
            plan.days[i]._id = matcher._id;
            _.each(plan.days[i].items, (it) => {
              oItems.push({
                travelPlan: plan._id,
                travelPlanDay: plan.days[i]._id,
                dayNo: plan.days[i].dayNo,
                itemType: it.itemType,
                itemId: it.itemId,
                name: it.name,
                destName: it.destName,
                imgUrl: it.imgUrl,
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
          // console.log('>>>>Model.createPlanDayItem', oItems);
          Model.createPlanDayItem(oItems, (err, tmpItems) => {
            if (err) {
              console.error('>>>>Model.createPlanDayItem Failed', err);
              return;
            }
            // console.log('>>>>Model.createPlanDayItem Saved', tmpItems);
            // TODO: Send back updated object id
            socket.emit('plan:save', {planId: plan._id});
          });
        } else {
          // TODO: Send back updated object id
          socket.emit('plan:save', {planId: plan._id});
        }
      });
    });
  } else {
    // TODO: Get plan from DB and then compare with web plan
    // ToBeReplaced: delete all days and items, then re-create
    async.series(
      [
        (callback) => {
          Model.deletePlanDay({travelPlan: plan._id}, callback);
        },
        (callback) => {
          Model.deletePlanItem({travelPlan: plan._id}, callback);
        },
      ],
      function(err) {
        if (err) {
          console.error(`>>>>Model plan[${plan._id}] days/items delete Failed`);
          return;
        }
        // console.log(`>>>>Model plan[${plan._id}] days/items deleted`);
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
        // console.log('>>>>Model.createPlanDay', oDays);
        Model.createPlanDay(oDays, (err, tmpDays) => {
          if (err) {
            console.error('>>>>Model.createPlanDay Failed', err);
            return;
          }
          // console.log('>>>>Model.createPlanDay Saved', tmpDays);
          const oItems = [];
          for (let i = 0; i < plan.days.length; i++) {
            const matcher = _.find(tmpDays, (td) => {
              return td.dayNo === plan.days[i].dayNo;
            });
            if (matcher) {
              plan.days[i]._id = matcher._id;
              _.each(plan.days[i].items, (it) => {
                oItems.push({
                  travelPlan: plan._id,
                  travelPlanDay: plan.days[i]._id,
                  dayNo: plan.days[i].dayNo,
                  itemType: it.itemType,
                  itemId: it.itemId,
                  name: it.name,
                  destName: it.destName,
                  imgUrl: it.imgUrl,
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
            // console.log('>>>>Model.createPlanDayItem', oItems);
            Model.createPlanDayItem(oItems, (err, tmpItems) => {
              if (err) {
                console.error('>>>>Model.createPlanDayItem Failed', err);
                return;
              }
              // console.log('>>>>Model.createPlanDayItem Saved', tmpItems);
            });
          }
        });
      }
    );
  }
};

const savePlanDay = (input) => {
  // console.log('>>>>Socket.savePlanDay', {request, socketUsers});
  const {request, sendStatus, socket, socketUsers} = input;
  const {packageId, totalDays, carOption, senderId} = request;
};

const savePeople = (input) => {
  const {request, sendStatus, socket, socketUsers} = input;
  // console.log('>>>>Socket.savePeople', {request, socketUsers});
  Model.updatePlanPeople(request, (err, result) => {
    // console.log('>>>>Socket.savePeople completed', {err, result});
  });
};

const saveHotel = (input) => {
  const {request, sendStatus, socket, socketUsers} = input;
  // console.log('>>>>Socket.saveHotel', {request, socketUsers});
  Model.updatePlanDayHotel(request, (err, result) => {
    // console.log('>>>>Socket.saveHotel completed', {err, result});
  });
};

const addPlanItem = (input) => {
  const {request, allInRoom, sendStatus, socket, socketUsers} = input;
  // console.log('>>>>Socket.addPlanItem', {request, socketUsers});
  const {senderId, planId, dayNo, item} = request;
  const filter = {
    travelPlan: planId,
    dayNo: dayNo,
  };
  Model.findPlanDay(filter, (err, docs) => {
    if (err) {
      console.log('>>>>Model.findPlanDay failed', err);
      return;
    }
    // console.log('>>>>Model.findPlanDay result', docs);
    if (docs && docs.length > 0) {
      const dayId = docs[0]._id;
      const oItem = {
        travelPlan: planId,
        travelPlanDay: dayId,
        dayNo: dayNo,
        itemType: item.itemType,
        itemId: item.itemId,
        name: item.name,
        destName: item.destName,
        imgUrl: item.imgUrl,
        totalPeople: item.totalPeople,
        unitPrice: item.unitPrice,
        createdAt: new Date(),
        createdBy: senderId,
        updatedAt: new Date(),
        updatedBy: senderId,
      };
      Model.createPlanDayItem(oItem, (err) => {
        if (err) {
          console.log('>>>>Model.createPlanDayItem failed', err);
          return;
        }
        // console.log('>>>>Model.createPlanDayItem completed');
      });
    }
  });
};

const removePlanItem = (input) => {
  const {request, allInRoom, sendStatus, socket, socketUsers} = input;
  // console.log('>>>>Socket.removePlanItem', {request, socketUsers});
  const {planId, dayNo, itemId} = request;
  const filter = {
    travelPlan: planId,
    dayNo: dayNo,
    itemId: itemId,
  };
  Model.deletePlanItem(filter, (err) => {
    if (err) {
      console.log('>>>>Model.deletePlanItem failed', err);
      return;
    }
    // console.log('>>>>Model.deletePlanItem completed');
  });
};

const listAllPlan = (input) => {
  const {request, socket, socketUsers} = input;
  // console.log('>>>>Socket.listAllPlan() start', {request, socketUsers});
  const filter = {
    createdBy: request.senderId,
    status: InstanceStatus.INITIATED,
  };
  Model.findPlan(filter, (err, plans) => {
    if (err) {
      console.error('>>>>Model.findPlan failed', err);
    }
    // console.log('>>>>Model.findPlan completed', plans);
    socket.emit('plan:all', plans);
  });
};

const updatePlanStatus = (input) => {
  const {request, socket, socketUsers} = input;
  console.log('>>>>Socket.updatePlanStatus() start', {request, socketUsers});
  const filter = {
    _id: request.planId,
  };
  const update = {
    status: request.status,
    updatedAt: new Date(),
    updatedBy: request.senderId,
  };
  Model.updatePlanStatus(filter, update, (err) => {
    if (err) {
      console.error('>>>>Model.updatePlanStatus failed', err);
    }
    console.log('>>>>Socket.updatePlanStatus completed');
    if (request.status === InstanceStatus.DEPOSIT_PAID) {
      socket.emit('page:close', {});
    }
  });
};

export default {
  savePlan,
  savePlanDay,
  addPlanItem,
  removePlanItem,
  savePeople,
  saveHotel,
  listAllPlan,
  updatePlanStatus,
};
