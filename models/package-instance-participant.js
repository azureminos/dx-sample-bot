// ===== DB ====================================================================
import Knex  from '../db/knex';
import AppConfig from '../config/app-config';

const PackageParticipant = () => Knex('package_inst_participant');
const platformType = AppConfig.getPlatformType();

// ===== Package ======================================================
const getParticipantByInstId = (instId) =>
  PackageParticipant()
    .select('id', 'is_owner as isOwner', 'liked_attractions as likedAttractions', 'login_id as loginId')
    .where('pkg_inst_id', instId);

const getOwnerByInstId = (instId) => {
  console.log('>>>>getOwnerByInstId, instId['+instId+']');
  return PackageParticipant()
    .where({pkg_inst_id: instId, is_owner: true})
    .first('login_id as loginId');
};

const addParticipant = (instId, loginId) => {
  console.log('>>>>addParticipant, instId['+instId+'], loginId['+loginId+']');
  return getOwnerByInstId(instId)
    .then((user) => !!user)
    .then((hasOwner) =>
      PackageParticipant()
        .where({pkg_inst_id: instId, login_id: loginId})
        .first()
        .then((usersInst) => ({hasOwner, alreadyAdded: !!usersInst}))
    )
    .then(({hasOwner, alreadyAdded}) => {
      if (alreadyAdded && !hasOwner) {
        //M=Need Fix
        return PackageParticipant()
          .where({pkg_inst_id: instId, login_id: loginId})
          .first()
          .update({is_owner: true}, ['id', 'login_id', 'is_owner', 'pkg_inst_id']);
      } else if (alreadyAdded) {
        return PackageParticipant()
          .where({pkg_inst_id: instId, login_id: loginId})
          .first('id', 'login_id as loginId', 'is_owner as isOwner', 'pkg_inst_id as instId');
      }

      return PackageParticipant()
        .insert(
          {is_owner: !hasOwner, pkg_inst_id: instId, login_id: loginId},
          ['id', 'login_id', 'is_owner', 'pkg_inst_id']
        );
    });
};

const delParticipantByInstId = (instId) =>
  PackageParticipant()
    .where('pkg_inst_id', instId)
    .del();

export default {
  getParticipantByInstId,
  getOwnerByInstId,
  addParticipant,
  delParticipantByInstId,
};
