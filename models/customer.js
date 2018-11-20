/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== DB ====================================================================
import Knex  from '../db/knex';
import AppConfig from '../config/app-config';

// ===== UTIL ==================================================================
import {camelCaseKeys} from './util';

const Customer = () => Knex('all_user');
const platformType = AppConfig.getPlatformType();

/**
 * findOrCreate - Finds or Creates a new User, and returns that user.
 * @param   {Object} user - The user to find or create.
 * @returns {Object} user - The created user.
 */
export const findOrCreate = (user = {}) => {
  return Customer()
    .where({'login_id': user.loginId, 'login_type': platformType})
    .first()
    .then((foundUsers) => {
      if (!foundUsers) {
        return Customer().insert({login_type: platformType, login_id: user.loginId}, 'login_id');
      }
      return Customer()
        .where('login_id', user.loginId)
        .update(user, 'login_id');
    })
    .then((userFbId) => {
      return Customer()
        .where('login_id', user.loginId)
        .first()
        .then(camelCaseKeys);
    });
};

/**
 * get - Gets a User object from the database.
 * @param   {userFbId} userFbId - the FB ID to find a User by.
 * @returns {Object} user - The found user.
 */
export const get = (userFbId) =>
  Customer()
    .where('fb_id', parseInt(userFbId, 10))
    .first()
    .then(camelCaseKeys);

export default {findOrCreate, get};
