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
      table.string('description', 2048);
      table.string('region');
      table.string('tag');
      table.string('alias');
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('city', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.string('description', 2048);
      table.integer('country_id').references('country.id').notNullable();
      table.string('tag');
      table.string('alias');
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('hotel', (table) => {
      table.increments();
      table.integer('city_id').references('city.id').notNullable();
      table.string('name').notNullable();
      table.string('description', 2048);
      table.integer('stars');
      table.string('type');
      table.string('room_type');
      table.decimal('cost', 10, 2);
      table.decimal('rate', 10, 2);
      table.string('notes', 2048);
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('hotel_image', (table) => {
      table.increments();
      table.integer('hotel_id').references('hotel.id').notNullable();
      table.string('image_url').notNullable();
      table.boolean('is_cover_page');
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('attraction', (table) => {
      table.increments();
      table.integer('city_id').references('city.id').notNullable();
      table.string('name').notNullable();
      table.string('description', 2048);
      table.string('tag');
      table.string('alias');
      table.integer('visit_hours');
      table.integer('traffic_hours');
      table.decimal('cost', 10, 2);
      table.decimal('rate', 10, 2);
      table.string('nearby_attractions');
      table.string('notes', 2048);
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('attraction_image', (table) => {
      table.increments();
      table.integer('attraction_id').references('attraction.id').notNullable();
      table.string('image_url').notNullable();
      table.boolean('is_cover_page');
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('package', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.string('description', 2048);
      table.string('fine_print', 2048);
      table.string('notes', 2048);
      table.integer('days');
      table.integer('max_participant').defaultTo(0);
      table.boolean('is_promoted').defaultTo(false);
      table.boolean('is_active').defaultTo(false);
      table.boolean('is_extention').defaultTo(false);
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('package_item', (table) => {
      table.increments();
      table.integer('pkg_id').references('package.id').notNullable();
      table.integer('day_no');
      table.integer('day_seq');
      table.integer('attraction_id').references('attraction.id').notNullable();
      table.string('description', 2048);
      table.string('notes', 2048);
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('package_hotel', (table) => {
      table.increments();
      table.integer('pkg_id').references('package.id').notNullable();
      table.integer('day_no');
      table.integer('hotel_id');
      table.string('notes', 2048);
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('package_image', (table) => {
      table.increments();
      table.integer('pkg_id').references('package.id').notNullable();
      table.string('image_url').notNullable();
      table.boolean('is_cover_page');
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('package_rate', (table) => {
      table.increments();
      table.integer('pkg_id').references('package.id').notNullable();
      table.integer('tier').notNullable();
      table.decimal('premium_fee', 10, 2);
      table.integer('max_participant').defaultTo(0);
      table.integer('min_participant').defaultTo(0);
      table.decimal('cost', 10, 2);
      table.decimal('rate', 10, 2);
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('car_rate', (table) => {
      table.increments();
      table.integer('pkg_id').references('package.id').notNullable();
      table.integer('max_participant').defaultTo(0);
      table.integer('min_participant').defaultTo(0);
      table.string('type');
      table.string('description', 2048);
      table.decimal('hour_cost', 10, 2);
      table.decimal('hour_rate', 10, 2);
      table.decimal('min_day_cost', 10, 2);
      table.decimal('min_day_rate', 10, 2);
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('flight_rate', (table) => {
      table.increments();
      table.integer('pkg_id').references('package.id').notNullable();
      table.string('airline');
      table.string('type');
      table.string('description', 2048);
      table.boolean('is_peak');
      table.string('flight_dates', 1024);
      table.date('flight_range_from');
      table.date('flight_range_to');
      table.decimal('cost', 10, 2);
      table.decimal('rate', 10, 2);
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('package_inst', (table) => {
      table.increments();
      table.integer('pkg_id').references('package.id').notNullable();
      table.date('start_date');
      table.date('end_date');
      table.boolean('is_premium').defaultTo(false);
      table.boolean('is_custom').defaultTo(false);
      table.string('type');
      table.integer('kid_total');
      table.integer('adult_total');
      table.decimal('cost', 10, 2);
      table.string('comments', 2048);
      table.string('case_notes', 2048);
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('package_inst_participant', (table) => {
      table.increments();
      table.integer('pkg_inst_id').references('package_inst.id').notNullable();
      table.string('login_id').notNullable();
      table.boolean('is_owner').defaultTo(false);
      table.integer('kid_participant');
      table.integer('adult_participant');
      table.string('liked_attractions'); // comma separated attraction id
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('package_inst_item', (table) => {
      table.increments();
      table.integer('pkg_inst_id').references('package_inst.id').notNullable();
      table.integer('attraction_id').references('attraction.id').notNullable();
      table.integer('day_no');
      table.integer('day_seq');
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('package_inst_hotel', (table) => {
      table.increments();
      table.integer('pkg_inst_id').references('package_inst.id').notNullable();
      table.integer('day_no');
      table.integer('hotel_id');
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('all_user', (table) => {
      table.increments();
      table.string('login_type');
      table.string('login_id');
      table.string('name');
      table.string('mobile');
      table.string('phone');
      table.string('email');
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('change_log', (table) => {
      table.increments();
      table.string('login_id');
      table.string('pkg_inst_id');
      table.string('action');
      table.string('updated_by');
      table.string('additional_field', 2048);
      table.timestamp('created_ts').defaultTo(knex.fn.now());
      table.timestamp('updated_ts').defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([]);
};
