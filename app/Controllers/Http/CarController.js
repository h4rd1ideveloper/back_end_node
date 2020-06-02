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
   * Fire response with code and body.
   *
   * @param {Response} response
   * @param message
   * @param fields
   * @param payload
   * @param {Object} props
   * @param {number} code
   **/
  _error(response, {message, fields = '', payload = '', ...props}, code = 400) {
    return response.status(code).send(JSON.stringify({error: true, message, fields, payload, ...props}));
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
  async index({request, response}) {
    const car_id = request.header('authorization', false)
    const page_start = request.header('page_start', 1)
    const page_end = request.header('page_end', 20)
    try {
      return response.send(await (car_id ?
          Car.query().with('user').where('id', car_id) :
          Car.query().with('user').forPage(Number(page_start), Number(page_end))
        ).fetch()
      );
    } catch ({message}) {
      return this._error(response, {message, fields: !car_id ? ['authorization'] : []})
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
      return response.send((await Car.create(body)).toJSON())
    } catch ({message}) {
      return this._error(response, {
        message,
        fields: this._fields(request.post(), ['name', 'color', 'brand', 'year', 'plate', 'user_id'])
      })
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
      return response.send((await Car.findByOrFail('id', id)).toJSON())
    } catch ({message}) {
      return this._error(response, {message, fields: this._fields(params, ['id'])})
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
      const car = await Car.findOrFail(params.id)
      const {payload: data} = request.only(['payload'])
      car.merge(data);
      await car.save();
      return car;
    } catch ({message}) {
      return this._error(response, {
        message,
        fields: request
          .post()
          .hasOwnProperty('payload') ? this._fields((request.post()).payload, ['id', 'payload']) : []
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
  async destroy({params, request, response}) {
    try {
      const {id} = params
      const car = await Car.find(id)
      await car.delete()
    } catch ({message}) {
      return this._error(response, {message, fields: this._fields(params, ['id'])})
    }
  }
}

module.exports = CarController
