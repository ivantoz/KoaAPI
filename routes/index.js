const router = require('koa-joi-router');
const usersRoutes = require('./users');
const fellowssRoutes = require('./fellows');

const users = router();
users.prefix('/users');
users.route(usersRoutes);

// const fellows = router();
// roles.prefix('/fellows');
// roles.route(fellowssRoutes);

const routes = {
  users,
  // fellows,
};

module.exports = routes;
