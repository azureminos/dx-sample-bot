// ===== DB ====================================================================
import Knex  from '../db/knex';

const PackageParticipant = () => Knex('package_participant');

// ===== Package ======================================================
const getPackageParticipant = (instId) =>
  PackageParticipant()
    .select('user_fb_id as userId', 'is_owner as isOwner')
    .where('pkg_inst_id', instId)

const addPackageParticipant = (instId, userId, isOwner) =>
  PackageParticipant().insert(
    {
      pkg_inst_id: instId,
      user_fb_id: userId,
      is_owner: isOwner,
    }
  )

const delPackageParticipant = (instId) =>
  PackageParticipant()
    .where('pkg_inst_id', instId)
    .del()

export default {
  getPackageParticipant,
  addPackageParticipant,
  delPackageParticipant,
};
