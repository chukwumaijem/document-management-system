'use strict';

const app = require('../../server'),
  expect = require('chai').expect,
  supertest = require('supertest'),
  api = supertest(app);

describe('Search documents', function () {
  it('should return documents that can be accessed only be a specified role', function (done) {
    api.get('/documents/query?limit=5&role=admin')
      .expect(200).end((err, res) => {
        expect(res.body).to.have.lengthOf(1);
        if (err) return done(err);
        done();
      });
  });

  it('should print appropriate message if document do not exist for a role', function (done) {
    api.get('/documents/query?limit=5&role=reader')
      .expect(200).end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('No document exists for this user.');
        if (err) return done(err);
        done();
      });
  });

  it('should return documents that were published ona certain date', function (done) {
    api.get('/documents/query?limit=5&date=2016-10-17')
      .expect(200).end((err, res) => {
        expect(res.body).to.have.lengthOf(5);
        if (err) return done(err);
        done();
      });
  });

  it('should print appropriate message if document do not exist for a date', function (done) {
    api.get('/documents/query?limit=5&date=2016-10-01')
      .expect(200).end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('No document was published on this date.');
        if (err) return done(err);
        done();
      });
  });
});