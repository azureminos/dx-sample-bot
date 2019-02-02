// ===== DB ====================================================================
import Knex  from '../db/knex';

const CaseNotes = () => Knex('package_inst_notes');

// ===== Package ======================================================
const getNotes = (instId) =>
  CaseNotes()
    .where('pkg_inst_id', instId)
    .select('id', 'login_id as userId', 'notes as text', 'created_ts as timestamp');

const setNotes = (note) =>
  CaseNotes()
    .where('id', note.id)
    .update(
      {
        pkg_inst_id: note.instId,
        login_id: note.userId,
        notes: note.text,
        //updated_ts: (new Date()),
      },
      ['id']);

const addNotes = (note) =>
  CaseNotes()
    .insert(
      {
        pkg_inst_id: note.instId,
        login_id: note.userId,
        notes: note.text,
      },
      ['id', 'login_id as userId', 'created_ts as timestamp', 'notes as text'])
    .then(([result]) => {
      console.log('>>>>Notes added', result);
      return {...result, timestamp: result.timestamp.getTime()};
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
