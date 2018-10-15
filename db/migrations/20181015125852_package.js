/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('country', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.string('desc');
      table.string('region');
      table.string('tag');
      table.string('alias');
    }),

    knex.schema.createTable('city', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.string('desc');
      table.integer('country_id').references('country.id').notNullable();
      table.string('tag');
      table.string('alias');
    }),

    knex.schema.createTable('attraction', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.string('desc');
      table.integer('city_id').references('city.id').notNullable();
      table.string('tag');
      table.string('alias');
    }),

    knex.schema.createTable('attraction_image', (table) => {
      table.increments();
      table.binary('image').notNullable();
      table.boolean('is_coverpage');
      table.integer('attraction_id').references('attraction.id').notNullable();
    }),

    knex.schema.createTable('package', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.string('desc');
      table.integer('days');
      table.boolean('is_promoted').defaultTo(false);
      table.boolean('is_active').defaultTo(false);
    }),

    knex.schema.createTable('rate_plan', (table) => {
      table.increments();
      table.integer('pkg_id').references('package.id').notNullable();
      table.integer('tier').notNullable();
      table.decimal('premium_fee', 10, 2);
      table.integer('min_joins').defaultTo(0);
      table.decimal('pkg_rate', 10, 2);
    }),

    knex.schema.createTable('package_image', (table) => {
      table.increments();
      table.integer('pkg_id').references('package.id').notNullable();
      table.binary('image');
      table.boolean('is_coverpage').defaultTo(false);
    }),

    knex.schema.createTable('package_item', (table) => {
      table.increments();
      table.integer('pkg_id').references('package.id').notNullable();
      table.integer('day_no');
      table.integer('order');
      table.integer('attraction_id').references('attraction.id').notNullable();
    }),

    knex.schema.createTable('package_inst', (table) => {
      table.increments();
      table.integer('pkg_id').references('package.id').notNullable();
      table.date('start_date');
      table.date('end_date');
      table.integer('rate_id').references('rate_plan.id').notNullable();
    }),

    knex.schema.createTable('package_participant', (table) => {
      table.increments();
      table.integer('pkg_inst_id').references('package_inst.id').notNullable();
      table.integer('user_fb_id').notNullable();
      table.string('name');
      table.boolean('is_owner').defaultTo(false);
    }),

    knex.schema.createTable('package_inst_items', (table) => {
      table.increments();
      table.integer('pkg_inst_id').references('package_inst.id').notNullable();
      table.integer('pkg_item_id').references('attraction.id').notNullable();
      table.integer('day_no');
      table.integer('order');
      table.integer('created_by');
      table.integer('updated_by');
    }),

    /*knex.schema.createTable('users', (table) => {
      table.increments();
      table.bigInteger('fb_id').unique().notNullable();
    }),*/

  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
  ]);
};
