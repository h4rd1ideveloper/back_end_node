"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

/**
 * Resourceful controller for interacting with users
 */

class UserController {
  /**
   * @param {string} message
   * @param {Response} response
   * @param {number} code
   **/
  _error(response, message, code = 400) {
    return response.status(code).send(JSON.stringify({error: true, message}));
  }

  /**
   * Show a list of all cars.
   * GET cars
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({request, response}) {
    try {
      const user = request.header('authorization', false)
      return response.send((user ?
          await User.findOrFail(user) :
          await User.all()
        ).toJSON()
      )
    } catch (e) {
      return this._error(response, e.message)
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
  async store({request, response}) {
    try {
      const body = request.only(['name', 'email', 'password']);
      return response.send((await User.create(body)).toJSON())
    } catch ({message}) {
      return this._error(response, message)
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
  async show({params, request, response}) {
    try {
      const {id} = params
      return response.send((await User.findByOrFail('id', id)).toJSON())
    } catch ({message}) {
      return this._error(response, message)
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
  async update({params, request, response}) {
    try {
      const user = await User.findOrFail(params.id)
      const {payload: data} = request.only(['payload'])
      user.merge(data);
      await user.save();
      return user
    } catch ({message}) {
      return this._error(response, message)
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
  async destroy({params, request, response}) {
    try {
      const {id} = params
      const user = await User.find(id)
      await user.delete()
    } catch ({message}) {
      return this._error(response, message)
    }
  }
}

module.exports = UserController;
