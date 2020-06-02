'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/**
 * Resourceful controller for interacting with cars
 */
const Car = use("App/Models/Car");
const User = use("App/Models/User");


class CarController {
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
          await Car.findBy('user_id', user) :
          await Car.all()
        ).toJSON()
      );
    } catch ({message}) {
      return this._error(response,message)
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
      const body = request.only(['name', 'color', 'brand', 'year', 'plate', 'user_id']);
      return response.send((await Car.create(body))?.toJSON())
    } catch ({message}) {
      return this._error(response,message)
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
      const [id] = params
      return response.send((await Car.findByOrFail('id', id))?.toJSON())
    } catch ({message}) {
      return this._error(response,message)
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
      Car.findOrFail(request.only(['id'])).merge(request.only(['payload']))
      await Car.save()
    }catch ({message}) {
      return this._error(response,message)
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
    try{
      const [id] = params
      const Car = await Car.find(id)
      await Car.delete()
    }catch ({message}) {
      return this._error(response,message)
    }
  }
}

module.exports = CarController
