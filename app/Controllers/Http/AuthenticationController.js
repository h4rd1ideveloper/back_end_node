'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/**
 * Resourceful controller for interacting with cars
 */
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Car = use("App/Models/Car");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

class AuthenticationController {
  /**
   * Fire response with code and body.
   *
   * @param {Response} response
   * @param {string} message
   * @param {array} fields
   * @param {any} payload
   * @param {Object} props
   * @param {number} code
   **/
  _error(response, { message, fields = '', payload = '', ...props }, code = 400) {
    return response.status(code).send(JSON.stringify({ error: true, message, fields, payload, ...props }));
  }

  /**
   *
   * @param {Object} test
   * @param {array} fields
   * @return {array}
   **/
  _fields(test, fields = []) {
    return test ? fields.filter(v => !test.hasOwnProperty(v)) : false;
  }

  /**
   * Check Login
   * GET cars
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async login({ request, response }) {
    try {
      const data = request.only(['email', 'password'])
      const user = await User.findByOrFail('email', data.email)
      const is_valid_pass = await Hash.verify(data.password, user.password);
      let body = {
        error: !is_valid_pass,
        fields: is_valid_pass ? [] : ['password']
      }
      if (is_valid_pass) {
        const cars = await Car.query().where('user_id', user.id).fetch()
        body = { ...body, user: { ...user.$attributes, cars } }
      }
      return response.send(JSON.stringify(body))
    } catch ({ message }) {
      return this._error(response, { message, fields: [...this._fields(request.post(), ['email', 'password']), 'email'] }, 200)
    }
  }
}

module.exports = AuthenticationController
