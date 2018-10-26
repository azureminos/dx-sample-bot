// ===== DB ====================================================================
import Knex  from '../db/knex';

const PackageParticipant = () => Knex('package_participant');

// ===== Package ======================================================
const getParticipantByInstId = (instId) =>
  PackageParticipant()
    .select('user_fb_id as fbId', 'is_owner as isOwner', 'liked_attractions as likedAttractions')
    .where('pkg_inst_id', instId)

const getOwnerByInstId = (instId) =>
  PackageParticipant()
    .where({pkg_inst_id: instId, is_owner: true})
    .first('user_fb_id as fbId');

const addParticipant = (instId, fbId) => {
  console.log('>>>>Add package instance participant, instId['+instId+'], fbId['+fbId+']');
  return getOwnerByInstId(instId)
    .then((user) => !!user)
    .then((hasOwner) =>
      PackageParticipant()
        .where({pkg_inst_id: instId, user_fb_id: fbId})
        .first()
        .then((usersInst) => ({hasOwner, alreadyAdded: !!usersInst}))
    )
    .then(({hasOwner, alreadyAdded}) => {
      if (alreadyAdded && !hasOwner) {
        return PackageParticipant()
          .where({pkg_inst_id: instId, user_fb_id: fbId})
          .first()
          .update({is_owner: true}, ['id', 'user_fb_id as fbId', 'is_owner as isOwner', 'pkg_inst_id as instId']);
      } else if (alreadyAdded) {
        return PackageParticipant()
          .where({pkg_inst_id: instId, user_fb_id: fbId})
          .first();
      }

      return PackageParticipant()
        .insert(
          {is_owner: !hasOwner, pkg_inst_id: instId, user_fb_id: fbId},
          ['id', 'user_fb_id as fbId', 'is_owner as isOwner', 'pkg_inst_id as instId']
        );
    });
}

const delParticipantByInstId = (instId) =>
  PackageParticipant()
    .where('pkg_inst_id', instId)
    .del()

export default {
  getParticipantByInstId,
  getOwnerByInstId,
  addParticipant,
  delParticipantByInstId,
};
