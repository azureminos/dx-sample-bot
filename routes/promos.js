/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';

// ===== DB ====================================================================
import Promos from '../models/promos';

const router = express.Router();

const getAllPromos = (req, res) => {
  Promos.getAllPromos().then((promos) => {
    console.log('>>>>getAllPromos', promos);
    res.send(promos);
  });
};

const getPromo = (req, res) => {
  const promoId = req.params.promoId;
  Promos.get(promoId).then((promo) => {
    console.log('>>>>get('+promoId+')', promo);
    res.send(promo);
  });
};

const addPromo = (req, res) => {
};

const updatePromo = (req, res) => {
};

const deletePromo = (req, res) => {
};
router.get('/', getAllPromos);
router.get('/:promoId', getPromo);
router.put('/', addPromo);
router.post('/:promoId', updatePromo);
router.delete('/:promoId', deletePromo);

export default router;
