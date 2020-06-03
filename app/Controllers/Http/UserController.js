"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Car = use("App/Models/Car");
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
/**
 * Resourceful controller for interacting with users
 */

class UserController {
  /**
   * Fire response with code and body.
   *
   * @param {Response} response
   * @param message
   * @param fields
   * @param payload
   * @param {Object} props
   * @param {number} code
   **/
  _error(response, { message, fields = '', payload = '', ...props }, code = 400) {
    return response.status(code).send(JSON.stringify({ error: true, message, ...props, fields, payload })
    );
  }

  /**
   *
   * @param {Object} test
   * @param {array} fields
   **/
  _fields(test, fields = []) {
    return test ? fields.filter(v => !test.hasOwnProperty(v)) : false;
  }

  /**
   * Show a list of all cars.
   * GET cars
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response }) {
    const user = request.header('authorization', false)
    const page_start = request.header('page_start', 1)
    const page_end = request.header('page_end', 20)
    try {
      return response.send(await (user ?
        User.query().with('cars') :
        User.query().with('cars').forPage(Number(page_start), Number(page_end))
      ).fetch()
      );
    } catch ({ message, ...props }) {
      return this._error(response, { ...props, message, fields: !user ? ['authorization'] : [] })
    }
  }


  /**
   * Create/save a new car.
   * POST cars
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const body = request.only(['name', 'email', 'password']);
      const user = (await User.findOrCreate({ email: body.email }, body)).toJSON()
      const cars = await Car.query().where('user_id', user.id).fetch()
      const is_valid_pass = await Hash.verify(body.password, user.password)
      let data = {
        error: !is_valid_pass,
        fields: is_valid_pass ? [] : ['email'],
        user: { ...user, cars }
      }
      return response.send(data)
    } catch ({ message }) {
      return this._error(response, { message, fields: this._fields(request.post(), ['name', 'email', 'password']) }, 200)
    }
  }

  /**
   * Display a single car.
   * GET cars/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({ params, request, response }) {
    try {
      const { id } = params
      return response.send((await User.findByOrFail('id', id)).toJSON())
    } catch ({ message }) {
      return this._error(response, { message, fields: this._fields(params, ['id']) })
    }
  }


  /**
   * Update car details.
   * PUT or PATCH cars/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {

    try {
      const user = await User.findOrFail(params.id)
      const { payload: data } = request.only(['payload'])
      user.merge(data);
      await user.save();
      return user
    } catch ({ message }) {
      return this._error(response, {
        message,
        fields: request
          .post()
          .hasOwnProperty('payload') ? this._fields((request.post()).payload, ['name', 'email', 'password']) : [],
        payload: (request.post()).payload
      });
    }
  }

  /**
   * Delete a car with id.
   * DELETE cars/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      const { id } = params
      const user = await User.findOrFail(id)
      await user.delete()
    } catch ({ message }) {
      return this._error(response, { message, fields: this._fields(params, ['id']) })
    }
  }
}

module.exports = UserController;
