'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.resource('users', 'UserController')
  .apiOnly()
Route.resource('cars', 'CarController')
  .apiOnly()


/***
 Route.get('', 'UserController.index').as('users.index')
 Route.post('users', 'UserController.store').as('users.store')
 Route.get('users/:id', 'UserController.show').as('users.show')
 Route.put('users/:id', 'UserController.update').as('users.update')
 Route.patch('users/:id', 'UserController.update')
 Route.delete('users/:id', 'UserController.destroy').as('users.destroy')
 */
