// ===== DB ====================================================================
import Knex  from '../db/knex';

const RatePlan = () => Knex('rate_plan');

// ===== Region & Country ======================================================
const getAllRatePlan = () =>
  RatePlan()
    .select('id', 'pkg_id as packageId', 'tier', 'premium_fee as premiumFee',
      'min_joins as minJoins', 'pkg_rate as packageRate')

const getRatePlanByPackageId = (packageId) =>
  RatePlan()
    .select('id', 'pkg_id as packageId', 'tier', 'premium_fee as premiumFee',
      'min_joins as minJoins', 'pkg_rate as packageRate')
    .where('rate_plan.pkg_id', packageId)

const getRatePlanByPackageName = (packageName) =>
  RatePlan()
    .join('package', 'package.id', 'rate_plan.pkg_id')
    .select('id', 'pkg_id as packageId', 'tier', 'premium_fee as premiumFee',
      'min_joins as minJoins', 'pkg_rate as packageRate')
    .where('package.name', packageName)

const getRatePlan = (id) =>
  RatePlan()
    .select('id', 'pkg_id as packageId', 'tier', 'premium_fee as premiumFee',
      'min_joins as minJoins', 'pkg_rate as packageRate')
    .where('id', id)
    .fist()

const setRatePlan = (item) =>
  RatePlan()
    .where({id: item.id})
    .update(
      {
        pkg_id: item.packageId,
        tier: item.tier,
        premium_fee: item.premiumFee,
        min_joins: item.minJoins,
        pkg_rate: item.packageRate,
      },
      ['id', 'pkg_id as packageId', 'tier', 'premium_fee as premiumFee', 'min_joins as minJoins', 'pkg_rate as packageRate']
    )

const addRatePlan = (item) =>
  RatePlan()
    .insert(
      {
        pkg_id: item.packageId,
        tier: item.tier,
        premium_fee: item.premiumFee,
        min_joins: item.minJoins,
        pkg_rate: item.packageRate,
      },
      ['id', 'pkg_id as packageId', 'tier', 'premium_fee as premiumFee', 'min_joins as minJoins', 'pkg_rate as packageRate']
    )

const delRatePlan = (itemId) =>
  RatePlan()
    .where('id', itemId)
    .del();


export default {
  getAllRatePlan,
  getRatePlanByPackageId,
  getRatePlanByPackageName,
  getRatePlan,
  setRatePlan,
  addRatePlan,
  delRatePlan,
};
