const { Joi } = require('koa-joi-router');
const _ = require('lodash');
const createFilterQuery = require('../../lib/createFilterQuery');
Joi.objectId = require('joi-objectid')(Joi);

Joi.singleOrArray = validator => Joi.alternatives().try([Joi.array().items(validator), validator]);

module.exports = {
  method: 'get',
  path: '/',
  validate: {
    query: Joi.object().keys({
      fields: Joi.singleOrArray(Joi.string()),
      search: Joi.string().default(''),
      skip: Joi.number().integer().min(0).default(0),
      limit: Joi.number().integer().min(0)
        .max(100)
        .default(10),
      filter: Joi.object({
        dLevel: Joi.singleOrArray(Joi.string()),
        cohortName: Joi.singleOrArray(Joi.string()),
        email: Joi.singleOrArray(Joi.string().lowercase().email()),
        _id: Joi.singleOrArray(Joi.objectId()),
      })
        .rename('id', '_id')
        .default(),
      sort: Joi.object().default({ 'name.first': 1 }),
    }).optional(),
  },
  handler: async (ctx) => {
    const { Fellow } = ctx.models;
    const {
      fields, limit, skip, search, filter,
    } = ctx.request.query;
    let { sort } = ctx.request.query;
    let searchQuery = {};
    if (!_.isEmpty(filter)) {
      searchQuery = createFilterQuery(filter, {}, {});
    }
    const select = {};

    if (search) {
      const searchWithEmailAsExactPhrase = search
        .split(' ')
        .map(str => (str.includes('@') ? `"${str}"` : str))
        .join(' ');
      Object.assign(searchQuery, { $text: { $search: searchWithEmailAsExactPhrase } });
      select.score = { $meta: 'textScore' };
      sort = { score: { $meta: 'textScore' } };
    }

    const [fellows, count] = await Promise.all([
      Fellow
        .find(searchQuery, select)
        .limit(Number(limit))
        .skip(Number(skip))
        .sort(sort),
      Fellow
        .find(searchQuery, select)
        .count(),
    ]);

    const fellowsData = fellows.map(fellow => (fields ? _.pick(fellow, fields) : fellow));

    ctx.body = {
      users: fellowsData,
      count,
    };
    ctx.status = 200;
  },
};
