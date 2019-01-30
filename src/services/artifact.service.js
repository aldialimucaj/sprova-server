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

    async getArtifact(id, download) {
        const _id = ObjectId(id);
        const artifact = await Artifacts.findOne({ _id });
        if(download) {
            return utils.readArtifact(artifact);
        } else {
            return artifact;
        }
    }

    // ============================================================================

    async delArtifact(id) {
        const _id = ObjectId(id);
        const response = await Artifacts.remove({ _id });

        return formatRemove(response, _id);
    }

    // ============================================================================

    async postArtifact(value, file) {
        let result = {};
        const artifactsPath = utils.defineArtifactPath(value);
        const filePath = utils.saveArtifact(file, artifactsPath);
        const artifact = { title: value.title, type: file.type, filePath };

        artifact.createdAt = new Date();
        artifact.updatedAt = new Date();
        
        const artifactResult = await Artifacts.insertOne(artifact);

        result =  formatInsert(artifactResult);
        result.name = file.name;

        return result;
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