const ObjectId = require('mongodb').ObjectId;
const utils = require('../helpers/utils');
const { formatInsert, formatUpdate, formatRemove } = require('../helpers/utils');
var Artifacts = undefined;

class ArtifactService {
    constructor(db) {
        Artifacts = db.collection('artifacts');
    }

    // ============================================================================

    async getArtifacts(query, options) {
        return await Artifacts.find(query, options).toArray();
    }

    async getArtifact(id) {
        const _id = ObjectId(id);
        return await Artifacts.findOne({ _id });
    }

    // ============================================================================

    async delArtifact(id) {
        const _id = ObjectId(id);
        const response = await Artifacts.remove({ _id });

        return formatRemove(response, _id);
    }

    // ============================================================================

    async postArtifact(value) {
        let result = {};
        const artifactsPath = utils.cycleToPath(value);

        const artifact = { title: value.name };
        artifact.createdAt = new Date();
        artifact.updatedAt = new Date();
        
        const filePath = utils.saveArtifact(value, artifactsPath);
        const artifactResult = await Artifacts.insertOne(artifact);
        result.ok = 1;
        result.files.push({ _id: artifactResult.insertedId, filename: value.name, filePath, success: true });

        const response = await Artifacts.insertOne(value);

        return formatInsert(response);
    }

    // ============================================================================

    async putArtifact(id, value) {
        const _id = ObjectId(id);

        delete value._id;
        delete value.createdAt;
        // testCaseId comes in as string
        if (value.testCaseId) {
            value.testCaseId = ObjectId(value.testCaseId);
        }

        value.updatedAt = new Date();

        let response = await Artifacts.updateOne({ _id }, { $set: value });

        return formatUpdate(response, _id);
    }
}

module.exports = ArtifactService;