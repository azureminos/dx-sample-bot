// ===== DB ====================================================================
import Knex  from '../db/knex';

// ===== Raw Query ======================================================
const query = (txtQuery) =>
Knex()
  .raw(txtQuery)
  .then((rs) => {
    console.log(`>>>>Raw Query [${txtQuery}]`, rs);
    return rs;
  });

export default {
  query,
};
