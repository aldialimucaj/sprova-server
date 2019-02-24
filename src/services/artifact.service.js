const ObjectId = require('mongodb').ObjectId;
const utils = require('../helpers/utils');
const { formatInsert, formatUpdate, formatDelete } = require('../helpers/utils');
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
        const artifact = this.getArtifact(_id);
        if (artifact.filePath) {
            utils.removeArtifact(artifact);
        }
        const response = await Artifacts.deleteOne({ _id });

        return formatDelete(response, _id);
    }

    // ============================================================================

    async postArtifact(value, file) {
        let result = {};
        const artifactsPath = utils.defineArtifactPath(value);
        const filePath = utils.saveArtifact(file, artifactsPath);
        const artifact = Object.assign({ type: file.type, filePath, fileName: file.name }, value)

        artifact.createdAt = new Date();
        artifact.updatedAt = new Date();

        const artifactResult = await Artifacts.insertOne(artifact);

        result = formatInsert(artifactResult);
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