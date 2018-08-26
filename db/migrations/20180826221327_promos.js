
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('promos', (table) => {
      table.increments();
      table.string('title').notNullable();
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('promos'),
  ]);
};