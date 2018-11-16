/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

exports.up = (knex, Promise) => {
    return Promise.all([
      knex.schema.dropTable('package_inst_items'),
      knex.schema.dropTable('package_participant'),
      knex.schema.dropTable('package_inst'),
      knex.schema.dropTable('rate_plan'),
      knex.schema.dropTable('package_item'),
      knex.schema.dropTable('package'),
      knex.schema.dropTable('attraction'),
      knex.schema.dropTable('city'),
      knex.schema.dropTable('country'),
    ]).then(() => Promise.all([
      knex.schema.createTable('country', (table) => {
        table.increments();
        table.string('name').notNullable();
        table.string('description');
        table.string('region');
        table.string('tag');
        table.string('alias');
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
      knex.schema.createTable('city', (table) => {
        table.increments();
        table.string('name').notNullable();
        table.string('description');
        table.integer('country_id').references('country.id').notNullable();
        table.string('tag');
        table.string('alias');
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
      knex.schema.createTable('hotel', (table) => {
        table.increments();
        table.integer('city_id').references('city.id').notNullable();
        table.string('name').notNullable();
        table.string('description');
        table.string('stars');
        table.string('type_name');
        table.string('type_value');
        table.string('room_type');
        table.decimal('cost', 10, 2);
        table.string('notes');
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
      knex.schema.createTable('hotel_image', (table) => {
        table.increments();
        table.integer('hotel_id').references('hotel.id').notNullable();
        table.string('image_url').notNullable();
        table.boolean('is_active');
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
      knex.schema.createTable('attraction', (table) => {
        table.increments();
        table.integer('city_id').references('city.id').notNullable();
        table.string('name').notNullable();
        table.string('description');
        table.string('tag');
        table.string('alias');
        table.integer('visit_hours');
        table.integer('traffic_hours');
        table.string('nearby_attractions');
        table.string('notes');
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
      knex.schema.createTable('attraction_image', (table) => {
        table.increments();
        table.integer('attraction_id').references('attraction.id').notNullable();
        table.string('image_url').notNullable();
        table.boolean('is_active');
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
      knex.schema.createTable('package', (table) => {
        table.increments();
        table.string('name').notNullable();
        table.string('description');
        table.string('fine_print');
        table.string('notes');
        table.integer('days');
        table.integer('max_participant').defaultTo(0);
        table.boolean('is_promoted').defaultTo(false);
        table.boolean('is_active').defaultTo(false);
        table.boolean('is_extention').defaultTo(false);
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
      knex.schema.createTable('package_image', (table) => {
        table.increments();
        table.integer('pkg_id').references('package.id').notNullable();
        table.string('image_url').notNullable();
        table.boolean('is_active');
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
      knex.schema.createTable('package_depart_date', (table) => {
        table.increments();
        table.integer('pkg_id').references('package.id').notNullable();
        table.string('depart_dates');
        table.string('additional_field');
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
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
      knex.schema.createTable('car_rate', (table) => {
        table.increments();
        table.integer('pkg_id').references('package.id').notNullable();
        table.integer('max_participant').defaultTo(0);
        table.integer('min_participant').defaultTo(0);
        table.string('type_name');
        table.string('type_value');
        table.string('description');
        table.decimal('cost', 10, 2);
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
      knex.schema.createTable('flight_rate', (table) => {
        table.increments();
        table.integer('pkg_id').references('package.id').notNullable();
        table.string('airline');
        table.string('type_name');
        table.string('type_value');
        table.string('description');
        table.boolean('is_peak');
        table.date('range_from');
        table.date('range_to');
        table.decimal('cost', 10, 2);
        table.string('additional_field');
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
        table.string('type_name');
        table.string('type_value');
        table.decimal('pkg_fee', 10, 2);
        table.string('comments');
        table.string('notes');
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
      knex.schema.createTable('package_inst_participant', (table) => {
        table.increments();
        table.integer('pkg_inst_id').references('package_inst.id').notNullable();
        table.integer('user_id').references('all_user.id').notNullable();
        table.boolean('is_owner').defaultTo(false);
        table.string('liked_attractions'); // comma separated attraction id
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
      knex.schema.createTable('package_inst_item', (table) => {
        table.increments();
        table.integer('pkg_inst_id').references('package_inst.id').notNullable();
        table.integer('attraction_id').references('attraction.id').notNullable();
        table.integer('day_no');
        table.integer('day_seq');
        table.string('created_by');
        table.string('updated_by');
        table.string('additional_field');
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
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
      knex.schema.createTable('change_log', (table) => {
        table.increments();
        table.integer('user_id');
        table.string('pkg_inst_id');
        table.string('action');
        table.string('additional_field');
        table.timestamp('created_ts').defaultTo(knex.fn.now());
        table.timestamp('updated_ts').defaultTo(knex.fn.now());
      }),
    ]));
};

exports.down = (knex, Promise) => {
  return Promise.all([
  ]);
};
