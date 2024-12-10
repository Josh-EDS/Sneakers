'use strict';

/**
 * permission-level service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::permission-level.permission-level');
