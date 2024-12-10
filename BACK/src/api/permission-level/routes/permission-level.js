'use strict';

/**
 * permission-level router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::permission-level.permission-level');
