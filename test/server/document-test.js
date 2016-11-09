'use strict';

const app = require('../../server'),
  expect = require('chai').expect,
  supertest = require('supertest'),
  api = supertest(app);

describe('Documents Test Suite', function () {
  let adminToken, userToken;

  before(function (done) {
    api.post('/users/login').send({ username: 'ebuka', password: 'ebukaakubu' })
      .expect(200).end((err, res) => {
        adminToken = res.body.token;
        done();
      });
  });

  describe('Create Documents', function () {
    const docOne = {
      title: 'My test document',
      content: 'A document for my tests',
      RoleId: 2,
      ownerId: 3
    };

    it('should create a published date for document', function (done) {
      api.post('/documents').set({ 'x-access-token': adminToken })
        .send(docOne)
        .expect(201).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('createdAt');
          expect(res.body.createdAt).to.not.be.empty;
          done();
        });
    });
  });

  describe('Get Documents', function () {
    it('should return documents using specified limit', function (done) {
      api.get('/documents/query?limit=5').set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.length.of.at.most(5);
          done();
        });
    });

    it('should return documents using specified limit and starting point', function (done) {
      api.get('/documents/query?limit=5&start=4')
        .set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.length.within(0, 5);
        });

      api.get('/documents/query?limit=5&start=15')
        .set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.lengthOf(0);
          done();
        });
    });

    it('should return documents in the order of published date from most recent', function (done) {
      api.get('/documents/query?limit=5')
        .set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body[0].createdAt).to.be.at.least(res.body[1].createdAt);
          expect(res.body[1].createdAt).to.be.at.least(res.body[2].createdAt);
          expect(res.body[2].createdAt).to.be.at.least(res.body[3].createdAt);
          expect(res.body[3].createdAt).to.be.at.least(res.body[4].createdAt);
          done();
        });
    })
  });
});