const Router = require('koa-router');
const fs = require('fs');
const os = require('os');
const path = require('path');
var yeoman = require('yeoman-environment');

var env = yeoman.createEnv();
env.lookup();

const generatorsRouter = new Router();

generatorsRouter.get('/generators/:lang/testcases/:id', getGenerator);

async function getGenerator(ctx) {
    const { id, lang } = ctx.params;
    const randomDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sprova-generator-'));

    const token = ctx.request.headers.authorization.split(' ')[1];
    ctx.body = await new Promise((resolve) => {
        env.run(`sprova:${lang}`,
            {
                "url": `${ctx.protocol}://${ctx.host}`,
                "token": token,
                "testcase": id,
                "outputDir": randomDir
            },
            () => {
                resolve({ content: fs.readFileSync(path.join(randomDir, 'test.java'), 'utf8'), ok: 1 });
            });
    });
}

module.exports = generatorsRouter;