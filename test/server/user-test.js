'use strict';

const app = require('../../server'),
  expect = require('chai').expect,
  supertest = require('supertest'),
  api = supertest(app),
  bcrypt = require('bcryptjs');

describe('User Tests', function () {
  let userOne = {
    username: 'helen',
    firstName: 'Helena',
    lastName: 'Johnson',
    email: 'helen@nson.com',
    password: 'helenpass'
  };
  let adminToken, userToken;

  describe('Login User', function () {
    it('should login in a registered user.', function (done) {
      api.post('/users/login').send({ username: 'ebuka', password: 'ebukaakubu' })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('success');
          expect(res.body).to.have.property('token');

          expect(res.body.success).to.equal('Login successful.');
          adminToken = res.body.token;
          done();
        });
    });

    it('should throw error if username is not provided', function (done) {
      api.post('/users/login').send({ password: 'ebukaakubu' })
        .expect(400).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Username is required.');
          done();
        });
    });

    it('should throw error if password is not provided', function (done) {
      api.post('/users/login').send({ username: 'ebuka' })
        .expect(400).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Password is required.');
          done();
        });
    });
  });

  describe('Create user', function () {
    let resData, errData;
    it('should validate that required user data is provided', function (done) {
      api.post('/users')
        .send(userOne)
        .expect(201).end((err, res) => {
          resData = res;
          errData = err;
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('firstName');
          expect(res.body).to.have.property('lastName');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('password');
          done();
        });
    });

    it('should validate that provided user data is valid', function (done) {
      if (errData) {
        return done(errData);
      }
      expect(resData.body.username).to.not.be.empty;
      expect(resData.body.firstName).to.not.be.empty;
      expect(resData.body.lastName).to.not.be.empty;
      expect(resData.body.email).to.not.be.empty;
      expect(resData.body.password).to.not.be.empty;
      expect(bcrypt.compareSync(userOne.password, resData.body.password)).to.be.true;
      expect(resData.body.RoleId).to.not.be.empty;
      done();
    });

    it('should add a new user to the database', function (done) {
      api.get('/users')
        .set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.lengthOf(5);
          done();
        });
    });

    it('should validate that a new user created is unique', function (done) {
      api.post('/users').send(userOne)
        .expect(409).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('User already exist.');
          done();
        });
    });

    it('should validate that a new user created has a role', function (done) {
      let userTwo = {
        username: 'henry',
        firstName: 'Henry',
        lastName: 'Joon',
        email: 'henry@nson.com',
        password: 'henrypass'
      };

      api.post('/users').send(userTwo)
        .expect(201).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('RoleId');
          expect(res.body.RoleId).to.not.be.empty;
          expect(res.body.RoleId).to.equal(2);
          done();
        });
    });

    it('should validate that a new user has firstName and lastName', function (done) {
      let userThree = {
        username: 'alice',
        firstName: 'Alice',
        lastName: 'Wonderland',
        email: 'alice@nson.com',
        password: 'alicepass'
      };

      api.post('/users').send(userThree)
        .expect(201).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('firstName');
          expect(res.body).to.have.property('lastName');
          expect(res.body.firstName).to.equal(userThree.firstName);
          expect(res.body.lastName).to.equal(userThree.lastName);
          done();
        });
    });
  });

  describe('Get users', function () {
    it('should return all users if no user-id is specified', function (done) {
      api.get('/users').set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.lengthOf(7);
          done();
        });
    });

    it('should return the user with the specified user-id', function (done) {
      api.get('/users/5').set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('firstName');
          expect(res.body).to.have.property('lastName');
          expect(res.body).to.have.property('email');

          expect(res.body.id).to.equal(5);
          expect(res.body.username).to.equal('helen');
          expect(res.body.firstName).to.equal('Helena');
          expect(res.body.lastName).to.equal('Johnson');
          expect(res.body.email).to.equal('helen@nson.com');
          expect(res.body.RoleId).to.equal(2);
          done();
        });
    });
  });
});