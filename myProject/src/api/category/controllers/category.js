'use strict';
const { sanitize } = require('@strapi/utils')
const { category } = sanitize;
/**
 * category controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::category.category', 
({ strapi }) =>  ({
 
    async findOne(ctx) {
        console.log("hello1");
        // const response = await category.findOne(ctx);
        // console.log("response");
        console.log("hello2");
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);
      const { results, pagination } = await strapi.service('api::category.category').find(sanitizedQueryParams);
      const sanitizedResults = await this.sanitizeOutput(results, ctx);
   console.log("hello");
      return this.transformResponse(sanitizedResults, { pagination });
    }
  })
);
