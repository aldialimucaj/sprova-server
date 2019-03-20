const { name, version } = require('../../package.json');
const Router = require('koa-router');

const statusRouter = new Router({
    prefix: '/status'
});
  
statusRouter.all('/', (ctx) => {
    ctx.body = { 
        success: true, 
        name, 
        version, 
        serverTime: new Date() 
    }
});

module.exports = statusRouter;