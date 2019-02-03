const send = require('koa-send');
const log = require('../helpers/log');
const ArtifactService = require('../services/artifact.service');
const { formatQueryFromParams, formatOptionsFromParams } = require('../helpers/utils');

class ArtifactRestApi {
    constructor(router, db) {
        this.router = router;
        this.artifactService = new ArtifactService(db);
        log.info("successfully loaded ArtifactRestApi")
    }

    // ============================================================================

    /**
     * @api {get} /artifacts Request artifacts
     * 
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost/api/artifacts?limit=10&skip=0
     * 
     * @apiParam {Number} limit limit result number
     * @apiParam {Number} skip skip first N results
     * @apiParam {Object} sort sort by field ie. { title: 1 }
     * 
     * @apiName getArtifacts
     * @apiGroup Artifacts
     * 
     * @apiSuccess {Array} - list of artifacts
     */
    async getArtifacts(ctx) {
        const query = formatQueryFromParams(ctx.query);
        const options = formatOptionsFromParams(ctx.query);

        ctx.body = await this.artifactService.getArtifacts(query, options);
    }

    /**
     * @api {get} /artifacts/:id Request artifact
     * 
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost/api/artifacts/5af582d1dccd6600137334a0
     * 
     * @apiName getArtifact
     * @apiGroup Artifacts
     * 
     * @apiParam {Number} id artifact's unique ID.
     * 
     * @apiSuccess {String} title
     * @apiSuccess {String} description
     */
    async getArtifact(ctx) {
        const id = ctx.params.id;
        const query = formatQueryFromParams(ctx.query);
        const artifact = await this.artifactService.getArtifact(id);
        if (query.download) {
            await send(ctx, artifact.filePath, {
                setHeaders: function (res) {
                    res.setHeader('Content-Disposition', `attachment; filename="${artifact.fileName}"`);
                }
            });
        } else {
            ctx.body = artifact;
        }
    }

    // ============================================================================

    /**
     * @api {post} /artifacts Post new artifact
     * 
     * @apiExample {curl} Example usage:
     *     curl -X POST -d '{"key1":"value1", "key2":"value2"}' -H "Content-Type: application/json" http://localhost/api/artifacts 
     * 
     * @apiName postArtifact
     * @apiGroup Artifacts
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if unsuccessful
     * @apiSuccess {String} _id ID of newly added element
     */
    async postArtifact(ctx) {
        try {
            const value = formatQueryFromParams(JSON.parse(ctx.request.body.value));
            value.user = ctx.state.user;
            const file = ctx.request.files.file;
            ctx.body = await this.artifactService.postArtifact(value, file);
            ctx.status = 201;
        } catch (e) {
            throw new Error(e);
        }
    }

    // ============================================================================

    /**
     * @api {put} /artifacts/:id Edit artifact
     * 
     * @apiExample {curl} Example usage:
     *     curl -X PUT -d '{"key1":"value2"}' -H "Content-Type: application/json" http://localhost/api/artifacts/5af582d1dccd6600137334a0 
     * 
     * @apiName putArtifact
     * @apiGroup Artifacts
     * 
     * @apiParam {Number} id artifact's unique ID.
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
     * @apiSuccess {String} _id ID of edited element
     */
    async putArtifact(ctx) {
        const id = ctx.params.id;
        const value = ctx.request.body;
        value.user = ctx.state.user;
        ctx.body = await this.artifactService.putArtifact(id, value);
    }


    // ============================================================================

    /**
     * @api {del} /artifacts/:id Delete artifact
     * 
     * @apiExample {curl} Example usage:
     *     curl -X DEL http://localhost/api/artifacts/5af582d1dccd6600137334a0
     * 
     * @apiName delArtifact
     * @apiGroup Artifacts
     * 
     * @apiParam {Number} id artifact's unique ID.
     * 
     * @apiSuccess {Number} ok 1 if successful; 0 if  unsuccessful
     */
    async delArtifact(ctx) {
        const id = ctx.params.id;
        ctx.body = await this.artifactService.delArtifact(id);
    }


    /* ************************************************************************* */
    /*                                 ROUTES                                    */
    /* ************************************************************************* */

    register() {
        this.router.get('/artifacts', this.getArtifacts.bind(this));
        this.router.get('/artifacts/:id', this.getArtifact.bind(this));

        this.router.post('/artifacts', this.postArtifact.bind(this));

        this.router.put('/artifacts', this.putArtifact.bind(this));

        this.router.del('/artifacts', this.delArtifact.bind(this));
    }
}

module.exports = ArtifactRestApi;