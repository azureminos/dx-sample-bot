// ===== DB ====================================================================
import Knex  from '../db/knex';

const InstHotel = () => Knex('package_inst_hotel');

// ===== Package ======================================================
const getHotel = (instId) =>
  InstHotel()
    .where('pkg_inst_id', instId)
    .select('login_id as loginId', 'notes', 'created_ts as createdTime');

const setHotel = (notes) =>
  InstHotel()
    .where('id', notes.id)
    .update(
      {
        pkg_inst_id: notes.instId,
        login_id: notes.loginId,
        notes: notes.text,
        //updated_ts: (new Date()),
      },
      ['id']);

const addHotel = (notes) =>
  InstHotel()
    .insert(
      {
        pkg_inst_id: notes.instId,
        login_id: notes.loginId,
        notes: notes.text,
      },
      ['id'])
    .then(([result]) => {return result;});

const delHotel = (id) =>
  InstHotel()
    .where('id', id)
    .del();

const delAllHotel = (instId) =>
  InstHotel()
    .where('pkg_inst_id', instId)
    .del();

export default {
  getHotel,
  setHotel,
  addHotel,
  delHotel,
  delAllHotel,
};
