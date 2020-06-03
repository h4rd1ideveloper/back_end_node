'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')}  */
const Schema = use('Schema')

class CarsSchema extends Schema {
  up () {
    this.create('cars', (table) => {
      table.increments()
      table.string('name', 140).notNullable()
      table.string('color', 40).notNullable()
      table.string('brand', 60).notNullable()
      table.string('year',  4).notNullable()
      table.string('plate', 20).notNullable().unique()
      table.string
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('cars')
  }
}

module.exports = CarsSchema
