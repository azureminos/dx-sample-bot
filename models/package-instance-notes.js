// ===== DB ====================================================================
import Knex  from '../db/knex';

const CaseNotes = () => Knex('package_inst_notes');

// ===== Package ======================================================
const getNotes = (instId) =>
  CaseNotes()
    .where('pkg_inst_id', instId)
    .select('login_id as loginId', 'notes', 'created_ts as createdTime');

const setNotes = (notes) =>
  CaseNotes()
    .where('id', notes.id)
    .update(
      {
        pkg_inst_id: notes.instId,
        login_id: notes.loginId,
        notes: notes.text,
        //updated_ts: (new Date()),
      },
      ['id']);

const addNotes = (notes) =>
  CaseNotes()
    .insert(
      {
        pkg_inst_id: notes.instId,
        login_id: notes.loginId,
        notes: notes.text,
      },
      ['id'])
    .then(([result]) => {return result;});

const delNotes = (id) =>
  CaseNotes()
    .where('id', id)
    .del();

const delAllNotes = (instId) =>
  CaseNotes()
    .where('id', instId)
    .del();

export default {
  getNotes,
  setNotes,
  addNotes,
  delNotes,
  delAllNotes,
};
