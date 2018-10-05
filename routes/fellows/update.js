const { Joi } = require('koa-joi-router');
Joi.objectId = require('joi-objectid')(Joi);


module.exports = {
  method: 'patch',
  path: '/:fellowEmail',
  validate: {
    type: 'json',
    params: {
      id: Joi.objectId().required(),
    },
    body: Joi.object({
      _id: Joi.forbidden(),
      email: Joi.string(),
      cohortName: Joi.string(),
      name: Joi.object({
        first: Joi.string(),
        middle: Joi.string(),
        last: Joi.string(),
      }),
      dLevel: Joi.string(),
    }),
  },
  handler: [
    async (ctx) => {
      const { Fellow } = ctx.models;
      const { id, fellowEmail } = ctx.request.params;
      const fellowUpdates = ctx.request.body;
      const { userId } = ctx.state.jwt;

      const fellow = await Fellow.findById(id);
      ctx.assert(fellow, 404, 'fellow not found');

      fellowUpdates.docinfo = {
        updatedAt: new Date().toISOString(),
        updatedBy: userId,
      };
      fellow.updateFellow(fellowEmail, fellowUpdates);
      const updatedFellow = await fellow.save();
      ctx.body = updatedFellow;
      ctx.status = 200;
    },
  ],
};
