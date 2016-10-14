const app = require('../../server'),
  expect = require('chai').expect,
  supertest = require('supertest'),
  api = supertest(app);

describe('User Tests', function () {

  describe('Create user', function () {
    let userOne = {
      username: 'helen',
      firstName: 'Helena',
      lastName: 'Johnson',
      email: 'helen@nson.com',
      password: 'helenpass',
      role: 'admin'
    };

    it('should validate that required user data is provided', function (done) {
      api.post('/users').send(userOne)
        .end((err, res) => {
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('firstName');
          expect(res.body).to.have.property('lastName');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('password');
          expect(res.body).to.have.property('role');
        });
      done();
    });

    it('should validate that provied user data is valid', function (done) {
      api.post('/users').send(userOne)
        .end((err, res) => {
          expect(res.body.username).to.not.be.empty;
          expect(res.body.firstName).to.not.be.empty;
          expect(res.body.lastName).to.not.be.empty;
          expect(res.body.email).to.not.be.empty;
          expect(res.body.password).to.not.be.empty;
          expect(res.body.role).to.not.be.empty;
        });
      done();
    });

    it('should add a new user to the database', function (done) {
      api.post('/users').send(userOne)
        .expect(201).end((err, res) => {
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('firstName');
          expect(res.body).to.have.property('lastName');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('password');
          expect(res.body).to.have.property('role');
          expect(res.body).to.have.property('token');

          expect(res.body.username).to.equal(userOne.username);
          expect(res.body.firstName).to.equal(userOne.firstName);
          expect(res.body.lastName).to.equal(userOne.lastName);
          expect(res.body.email).to.equal(userOne.email);
          expect(res.body.password).to.equal(userOne.password);
          expect(res.body.role).to.have.property(userOne.role);
          expect(res.body.token).to.not.be.empty;
        });
      done();
    });

    it('should validate that a new user created is unique', function (done) {
      api.post('/users').send(userOne)
        .expect(400).end((err, res) => {
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be('User already exist.');
        });
      done();
    });

    it('should validate that a new user created has a role', function (done) {
      let userTwo = {
        username: 'henry',
        firstName: 'Henry',
        lastName: 'Joon',
        email: 'henry@nson.com',
        password: 'henrypass',
        role: 'member'
      };

      api.post('/users').send(userTwo)
        .expect(201).end((err, res) => {
          expect(res.body).to.have.property('role');
          expect(res.body.role).to.not.be.empty;
          expect(res.body.role).to.equal(userTwo.role);
        });
      done();
    });

    it('should validate that a new user has firstName and lastName', function (done) {
      let userThree = {
        username: 'alice',
        firstName: 'Alice',
        lastName: 'Wonderland',
        email: 'alice@nson.com',
        password: 'alicepass',
        role: 'editor'
      };

      api.post('/users').send(userThree)
        .expect(201).end((err, res) => {
          expect(res.body).to.have.property('firstName');
          expect(res.body).to.have.property('lastName');
          expect(res.body.firstName).to.equal(userThree.firstName);
          expect(res.body.lastName).to.equal(userThree.lastName);
        });
      done();
    });
  });

  describe('Get users', function () {
    it('should return all users if no user-id is specified', function (done) {
      api.get('/users').send(userOne)
        .expect(200).end((err, res) => {
          expect(res.body).to.have.lengthOf(8);
        });
      done();
    });

    it('should return the user with the specified user-id', function (done) {
      api.get('/users/6').send(userOne)
        .expect(200).end((err, res) => {
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('firstName');
          expect(res.body).to.have.property('lastName');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('role');

          expect(res.body.id).to.equal(6);
          expect(res.body.username).to.equal('helen');
          expect(res.body.firstName).to.equal('Helena');
          expect(res.body.lastName).to.equal('Johnson');
          expect(res.body.email).to.equal('helen@nson.com');
          expect(res.body.role).to.equal('admin');
        });
      done();
    });
  });
});