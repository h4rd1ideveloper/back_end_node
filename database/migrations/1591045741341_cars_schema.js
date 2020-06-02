'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CarsSchema extends Schema {
  up () {
    this.create('cars', (table) => {
      table.increments()
      table.string('name', 140)
      table.string('color', 40)
      table.string('brand', 60)
      table.string('year',  4)
      table.string('plate', 20)
      table.string
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('cars')
  }
}

module.exports = CarsSchema
