'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.resource('users', 'UserController')
  .apiOnly()
Route.resource('cars', 'CarController')
  .apiOnly()

Route.post('/login', 'AuthenticationController.login')

Route.get('/', ()=>"ok")