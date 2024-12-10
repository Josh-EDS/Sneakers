'use strict';

/**
 * product router
 */

// @ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::product.product');
