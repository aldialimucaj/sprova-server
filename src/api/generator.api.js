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
    ctx.body = await new Promise((resolve, reject) => {
        env.run(`sprova:${lang}`,
            {
                "url": `${ctx.protocol}://${ctx.host}`,
                "token": token,
                "testcase": id,
                "outputDir": randomDir
            },
            () => {
                const testFilePath = path.join(randomDir, 'test.java');
                if (fs.existsSync(testFilePath)) {
                    resolve({ content: fs.readFileSync(testFilePath, 'utf8'), ok: 1 });
                } else {
                    reject(new Error('Could not generate test file. Please check your syntax.'));
                }
            });
    });
}

module.exports = generatorsRouter;