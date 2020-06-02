'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */

/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class JsonResponse {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Function} next
   */
  async handle({response}, next) {
    // call next to advance the request
   // response.header('content-type', 'application/json')
    await next()
  }
}

module.exports = JsonResponse
