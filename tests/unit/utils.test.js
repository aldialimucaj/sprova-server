/* eslint-disable */
let config = { db: { host: '127.0.0.1' } };

// tools
const chai = require('chai');
const expect = chai.expect;
const ObjectId = require('mongodb').ObjectId;

const to = require('../../src/helpers/utils');

// tests

describe('utils : helper', () => {

  describe('formatIDs', () => {
    it('should format ids on first level', async () => {
      const fix1 = { _id: "5af582d1dccd6600137334a0", noid: "nono", yesId: "6af582d1dccd6600137334a3", }
      const fix1expected = { _id: ObjectId("5af582d1dccd6600137334a0"), noid: "nono", yesId: ObjectId("6af582d1dccd6600137334a3") }
      const fix1notexpected = { _id: ObjectId("4af582d1dccd6600137334a0"), noid: "nono", yesId: ObjectId("6af582d1dccd6600137334a3") }
      const result1 = to.formatIDs(fix1);
      expect(result1).to.eql(fix1expected);
      expect(result1).to.not.eql(fix1notexpected);
    });

    it('should format ids on second level', async () => {
      const fix1 = { _id: "4af582d1dccd6600137334a0", noid: "nono", inside: { _id: "aaf582d1dccd6600137334a7", goId: "5af582d1dccd6600137334a0" } }
      const fix1expected = { _id: ObjectId("4af582d1dccd6600137334a0"), noid: "nono", inside: { _id: ObjectId("aaf582d1dccd6600137334a7"), goId: ObjectId("5af582d1dccd6600137334a0") } }
      const result1 = to.formatIDs(fix1);
      expect(result1).to.eql(fix1expected);
    });

    it('should format ids in array', async () => {
      const fix1 = { fel: [{ mosId: "8af582d1dccd6600137338cc" }, { mosId: "9af582d1dccd6600137338cc" }] }
      const fix1expected = { fel: [{ mosId: ObjectId("8af582d1dccd6600137338cc") }, { mosId: ObjectId("9af582d1dccd6600137338cc") }] }
      const result1 = to.formatIDs(fix1);
      expect(result1).to.eql(fix1expected);
    });
  });
});
