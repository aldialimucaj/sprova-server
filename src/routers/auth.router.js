const Router = require('koa-router');
const authService = require('../helpers/auth');

const authRouter = new Router();

authRouter.post('/authenticate', async (ctx) => {
  await authService.authenticate(ctx);
});

module.exports = authRouter;