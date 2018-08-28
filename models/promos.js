/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
 /* eslint-disable camelcase */

// ===== DB ====================================================================
import Knex  from '../db/knex';

// ===== UTIL ==================================================================
import {camelCaseKeys} from './util';

const Promos = () => Knex('promos');

/**
 * getAllPromos - Gets all Promos
 * @returns {Array} lists - Array of all Lists.
 */
const get = (promoId) =>
  Promos()
    .where('id', parseInt(promoId, 10))
    .first()
    .then(camelCaseKeys);

const getAllPromos = () =>
  Promos().select();

export default {
  get,
  getAllPromos,
};
