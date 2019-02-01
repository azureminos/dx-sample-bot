// ===== DB ====================================================================
import Knex  from '../db/knex';

const CaseNotes = () => Knex('package_inst_notes');

// ===== Package ======================================================
const getNotes = (instId) =>
  CaseNotes()
    .where('pkg_inst_id', instId)
    .select('id', 'login_id as userId', 'notes as text', 'created_ts as timestamp');

const setNotes = (notes) =>
  CaseNotes()
    .where('id', notes.id)
    .update(
      {
        pkg_inst_id: notes.instId,
        login_id: notes.userId,
        notes: notes.text,
        //updated_ts: (new Date()),
      },
      ['id']);

const addNotes = (notes) =>
  CaseNotes()
    .insert(
      {
        pkg_inst_id: notes.instId,
        login_id: notes.userId,
        notes: notes.text,
      },
      ['id', 'login_id as userId', 'created_ts as timestamp', 'notes as text'])
    .then(([result]) => {
      console.log('>>>>Notes added', result);
      return result;
    });

const delNotes = (id) =>
  CaseNotes()
    .where('id', id)
    .del();

const delAllNotes = (instId) =>
  CaseNotes()
    .where('pkg_inst_id', instId)
    .del();

export default {
  getNotes,
  setNotes,
  addNotes,
  delNotes,
  delAllNotes,
};
