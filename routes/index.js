const router = require('koa-joi-router');
const usersRoutes = require('./users');
const fellowsRoutes = require('./fellows');

const users = router();
users.prefix('/');
users.route(usersRoutes);

const fellows = router();
fellows.prefix('/fellows');
fellows.route(fellowsRoutes);

const routes = {
  users,
  fellows,
};

module.exports = routes;
