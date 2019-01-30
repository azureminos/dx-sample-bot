// ===== DB ====================================================================
import Knex  from '../db/knex';

const ChangeLog = () => Knex('change_log');

// ===== Change Log ======================================================
const getChangeLog = (instId) =>
  ChangeLog()
    .join('all_user', {'all_user.login_id': 'change_log.login_id'})
    .join('package_inst', {'package_inst.id': 'change_log.pkg_inst_id'})
    .join('package', {'package.id': 'package_inst.pkg_id'})
    .select('change_log.pkg_inst_id as instId', 'package.name as packageName',
      'all_user.name as userName', 'all_user.login_id as loginId', 'change_log.action',
      'change_log.created_ts as createdTime', 'change_log.additional_field as additionalField')
    .where('change_log.pkg_inst_id', instId);

const addChangeLog = (change) =>
  ChangeLog()
    .insert({
      login_id: change.loginId,
      pkg_inst_id: change.instId,
      action: change.action,
      additional_field: change.additionalField,
    }, 'id');

const delChangeLog = (instId) =>
  ChangeLog()
    .where('pkg_inst_id', instId)
    .del();

export default {
  getChangeLog,
  addChangeLog,
  delChangeLog,
};
