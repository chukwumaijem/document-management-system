'use strict';

const app = require('../../server.js'),
  expect = require('chai').expect,
  supertest = require('supertest'),
  api = supertest(app);

describe('Role Tests', function () {
  let adminToken, userToken;

  before(function (done) {
    api.post('/users/login').send({ username: 'ebuka', password: 'ebukaakubu' })
      .expect(200).end((err, res) => {
        adminToken = res.body.token;
        done();
      });
  });

  describe('Create Role', function () {
    it('should add a role if role does not exist', function (done) {
      api.post('/roles').set({ 'x-access-token': adminToken })
        .send({ title: 'Editor' })
        .expect(201).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal('New role created successfully.');
          done();
        });
    });

    it('should not add role if it exists', function (done) {
      api.post('/roles').set({ 'x-access-token': adminToken })
        .send({ title: 'Editor' })
        .expect(409).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Role already exists.');
          done();
        });
    });
  });

  describe('Get Role', function () {
    it('should return all the roles available', function (done) {
      api.get('/roles').set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.lengthOf(3);
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Update role', function () {
    it('should update existing roles', function (done) {
      api.put('/roles/2').set({ 'x-access-token': adminToken })
        .send({ title: 'Reader' })
        .expect(200).end((err, res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal('Role updated successfully.');
          if (err) return done(err);
          done();
        });
    });

    it('should return approprite message for roles that do not exist', function (done) {
      api.put('/roles/4').set({ 'x-access-token': adminToken })
        .send({ title: 'Newbie' })
        .expect(400).end((err, res) => {
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Role does not exist.');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Delete Role', function () {
    it('should delete existing roles', function (done) {
      api.delete('/roles/3').set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal('Role was deleted successfully.');
          if (err) return done(err);
          done();
        });
    });

    it('should return approprite message for roles that do not exist', function (done) {
      api.delete('/roles/4').set({ 'x-access-token': adminToken })
        .expect(400).end((err, res) => {
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Role does not exist.');
          if (err) return done(err);
          done();
        });
    });
  })
});