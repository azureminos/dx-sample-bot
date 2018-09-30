/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('reference', (table) => {
      table.increments();
      table.string('category').notNullable();
      table.string('name').notNullable();
      table.string('value').notNullable();
      table.string('desc');
      table.integer('parent_id');
    }),

    knex.schema.createTable('tour', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.string('desc');
      table.integer('days');
      table.boolean('is_promoted').defaultTo(false);
      table.boolean('is_active').defaultTo(false);
    }),

    knex.schema.createTable('tour_image', (table) => {
      table.increments();
      table.integer('tour_id').references('tour.id').notNullable();
      table.binary('image');
      table.boolean('is_coverpage').defaultTo(false);
    }),

    knex.schema.createTable('tour_details', (table) => {
      table.increments();
      table.integer('tour_id').references('tour.id').notNullable();
      table.integer('day_no');
      table.integer('order');
      table.integer('item_id').references('reference.id').notNullable();
      table.string('desc');
    }),

    knex.schema.createTable('tour_inst', (table) => {
      table.increments();
      table.integer('tour_id').references('tour.id').notNullable();
      table.date('start_date');
      table.boolean('is_custom').defaultTo(false);
    }),

    knex.schema.createTable('tour_inst_user', (table) => {
      table.increments();
      table.integer('tour_inst_id').references('tour_inst.id').notNullable();
      table.integer('user_fb_id').notNullable();
      table.boolean('is_owner').defaultTo(false);
    }),

    knex.schema.createTable('tour_inst_items', (table) => {
      table.increments();
      table.integer('tour_inst_id').references('tour_inst.id').notNullable();
      table.integer('tour_item_id').references('reference.id').notNullable();
      table.integer('day_no');
      table.integer('order');
      table.integer('created_by');
      table.integer('updated_by');
    }),

  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('tour_inst_items'),
    knex.schema.dropTable('tour_inst_user'),
    knex.schema.dropTable('tour_inst'),
    knex.schema.dropTable('tour_details'),
    knex.schema.dropTable('reference'),
    knex.schema.dropTable('tour_image'),
    knex.schema.dropTable('tour'),
  ]);
};
