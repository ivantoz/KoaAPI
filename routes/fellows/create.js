const { Joi } = require('koa-joi-router');

module.exports = {
  method: 'post',
  path: '/',
  validate: {
    type: 'json',
    body: Joi.object({
      _id: Joi.forbidden(),
      email: Joi.string().required(),
      cohortName: Joi.string().required(),
      name: Joi.object({
        first: Joi.string().required(),
        middle: Joi.string(),
        last: Joi.string().required(),
      }).required(),
      dLevel: Joi.string().required(),
    }),
  },
  handler: async (ctx) => {
    const { userId } = ctx.state.jwt;
    const { Fellow } = ctx.models;
    const newFellowTosave = ctx.request.body;

    const fellow = await Fellow
      .findOne({ email: newFellowTosave.email })
      .exec();

    if (fellow) {
      ctx.throw(400, `Fellow with email: ${newFellowTosave.email} already saved`);
    }

    newFellowTosave.docinfo = {
      createdAt: new Date().toISOString(),
      createdBy: userId,
    };

    const newFellow = new Fellow(newFellowTosave);
    ctx.body = await newFellow.save();
    ctx.status = 201;
  },
};
