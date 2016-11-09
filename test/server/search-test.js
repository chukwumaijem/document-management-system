'use strict';

const app = require('../../server'),
  expect = require('chai').expect,
  supertest = require('supertest'),
  api = supertest(app);

describe('Search documents', function () {
  let adminToken, userToken;

  before(function (done) {
    api.post('/users/login').send({ username: 'ebuka', password: 'ebukaakubu' })
      .expect(200).end((err, res) => {
        adminToken = res.body.token;
        done();
      });
  });

  it('should return documents that can be accessed only be a specified role', function (done) {
    api.get('/documents/query?limit=5&role=admin')
      .set({ 'x-access-token': adminToken })
      .expect(200).end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.lengthOf(1);
        done();
      });
  });

  it('should print appropriate message if document do not exist for a role', function (done) {
    api.get('/documents/query?limit=5&role=Observer')
      .set({ 'x-access-token': adminToken })
      .expect(404).end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('No document matched the specified query.');
        done();
      });
  });

  it('should return documents that were published on a certain date', function (done) {
    api.get('/documents/query?limit=5&date=' + new Date().toISOString().substr(0, 10))
      .set({ 'x-access-token': adminToken })
      .expect(200).end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.lengthOf(5);
        done();
      });
  });

  it('should print appropriate message if document do not exist for a date', function (done) {
    api.get('/documents/query?limit=5&date=2016-10-01')
      .set({ 'x-access-token': adminToken })
      .expect(404).end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('No document matched the specified query.');
        done();
      });
  });
});