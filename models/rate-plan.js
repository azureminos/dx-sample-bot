// ===== DB ====================================================================
import Knex  from '../db/knex';

const PackageRate = () => Knex('package_rate');
const CarRate = () => Knex('car_rate');
const FlightRate = () => Knex('flight_rate');

// ===== Package Rate ======================================================
const getAllPackageRate = () =>
  PackageRate()
    .select('id', 'pkg_id as packageId', 'tier', 'premium_fee as premiumFee',
      'max_participant as maxParticipant', 'min_participant as minParticipant',
      'cost', 'rate')
    .orderBy('id', 'tier');

const getPackageRateByInstId = (instId) =>
  PackageRate()
    .join('package_inst', 'package_inst.pkg_id', 'package_rate.pkg_id')
    .select('id', 'tier', 'premium_fee as premiumFee', 'package_rate.cost', 'rate',
      'max_participant as maxParticipant', 'min_participant as minParticipant')
    .where('package_inst.id', instId)
    .orderBy('tier');

const getPackageRateByPackageId = (packageId) =>
  PackageRate()
    .select('id', 'tier', 'premium_fee as premiumFee', 'cost', 'rate',
      'max_participant as maxParticipant', 'min_participant as minParticipant')
    .where('pkg_id', packageId)
    .orderBy('tier');

const getPackageRate = (id) =>
  PackageRate()
    .select('id', 'tier', 'premium_fee as premiumFee', 'cost', 'rate',
      'max_participant as maxParticipant', 'min_participant as minParticipant')
    .where('id', id)
    .first();

/*const setPackageRate = (item) =>
  PackageRate()
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

const addPackageRate = (item) =>
  PackageRate()
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

const delPackageRate = (itemId) =>
  PackageRate()
    .where('id', itemId)
    .del();
*/

// ===== Car Rate ======================================================
const getAllCarRate = () =>
  CarRate()
    .select('id', 'pkg_id as packageId', 'type', 'description',
      'max_participant as maxParticipant', 'min_participant as minParticipant',
      'hour_cost as hourCost', 'hour_rate as hourRate',
      'min_day_cost as minDayCost', 'min_day_rate as minDayRate')
    .orderBy('id');

const getCarRateByInstId = (instId) =>
  CarRate()
    .join('package_inst', 'package_inst.pkg_id', 'car_rate.pkg_id')
    .select('car_rate.id', 'car_rate.type', 'description',
      'max_participant as maxParticipant', 'min_participant as minParticipant',
      'hour_cost as hourCost', 'hour_rate as hourRate',
      'min_day_rate as minDayRate', 'min_day_cost as minDayCost')
    .where('package_inst.id', instId)
    .orderBy('type', 'min_participant');

const getCarRateByPackageId = (packageId) =>
  CarRate()
    .select('id', 'type', 'description',
      'max_participant as maxParticipant', 'min_participant as minParticipant',
      'hour_cost as hourCost', 'hour_rate as hourRate',
      'min_day_rate as minDayRate', 'min_day_cost as minDayCost')
    .where('pkg_id', packageId)
    .orderBy('type', 'min_participant');

const getCarRate = (id) =>
  CarRate()
    .select('id', 'type', 'description',
      'max_participant as maxParticipant', 'min_participant as minParticipant',
      'hour_cost as hourCost', 'hour_rate as hourRate',
      'min_day_rate as minDayRate', 'min_day_cost as minDayCost')
    .where('id', id)
    .first();

// ===== Flight Rate ======================================================
const getAllFlightRate = () =>
  FlightRate()
    .select('id', 'pkg_id as packageId', 'airline', 'type', 'description',
      'flight_dates as flightDates', 'flight_range_from as flightRangeFrom',
      'flight_range_to as flightRangeTo', 'is_peak as isPeak', 'cost', 'rate')
    .orderBy('id');

const getFlightRateByInstId = (instId) =>
  FlightRate()
    .join('package_inst', 'package_inst.pkg_id', 'flight_rate.pkg_id')
    .select('flight_rate.id', 'airline', 'flight_rate.type', 'description',
      'flight_dates as flightDates', 'flight_range_from as flightRangeFrom',
      'flight_range_to as flightRangeTo', 'is_peak as isPeak',
      'flight_rate.cost', 'rate')
    .where('package_inst.id', instId)
    .orderBy('airline', 'type');

const getFlightRateByPackageId = (packageId) =>
  FlightRate()
    .select('id', 'airline', 'type', 'description', 'cost', 'rate',
      'flight_dates as flightDates', 'flight_range_from as flightRangeFrom',
      'flight_range_to as flightRangeTo', 'is_peak as isPeak')
    .where('pkg_id', packageId)
    .orderBy('airline', 'type');

const getFlightRate = (id) =>
  FlightRate()
    .select('id', 'airline', 'type', 'description', 'cost', 'rate',
      'flight_dates as flightDates', 'flight_range_from as flightRangeFrom',
      'flight_range_to as flightRangeTo', 'is_peak as isPeak')
    .where('id', id)
    .first();
  
// ===== Merged functions ======================================================
const getRateByInstId = (instId) =>
  Promise.all([
    getPackageRateByInstId(instId),
    getCarRateByInstId(instId),
    getFlightRateByInstId(instId),
  ])
  .then(([p, c, f]) => {
    return {
      packageRate: p,
      carRate: c,
      flightRate: f,
    };
  });

const getRateByPackageId = (packageId) =>
  Promise.all([
    getPackageRateByPackageId(packageId),
    getCarRateByPackageId(packageId),
    getFlightRateByPackageId(packageId),
  ])
  .then(([p, c, f]) => {
    return {
      packageRate: p,
      carRate: c,
      flightRate: f,
    };
  });

export default {
  // Package Rate
  getAllPackageRate,
  getPackageRateByInstId,
  getPackageRateByPackageId,
  getPackageRate,
  /*setPackageRate,
  addPackageRate,
  delPackageRate,*/
  // Car Rate
  getAllCarRate,
  getCarRateByInstId,
  getCarRateByPackageId,
  getCarRate,
  /*setCarRate,
  addCarRate,
  delCarRate,*/
  // Flight Rate
  getAllFlightRate,
  getFlightRateByInstId,
  getFlightRateByPackageId,
  getFlightRate,
  /*setFlightRate,
  addFlightRate,
  delFlightRate,*/
  // Get all rate in one go
  getRateByInstId,
  getRateByPackageId,
};
