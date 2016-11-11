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
      api.post('/users/login')
        .send({ username: 'ebuka', password: 'ebukaakubu' })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('success');
          expect(res.body).to.have.property('token');

          expect(res.body.success).to.equal('Login successful.');
          adminToken = res.body.token;
        });

      api.post('/users/login')
        .send({ username: 'adaobi', password: 'mmaduada' })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          userToken = res.body.token;
          done();
        });
    });

    it('should throw an error if username is not provided',
      function (done) {
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

    it('should throw an error if password is not provided',
      function (done) {
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

    it('should throw an error if username or password is invalid',
      function (done) {
        api.post('/users/login')
          .send({ username: 'ebuka', password: 'wrongpassword' })
          .expect(400).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('error');
            expect(res.body.error)
              .to.equal('Login failed. Username or password invalid.');
            done();
          });
      });
  });

  describe('Create user', function () {
    let resData, errData;
    it('should validate that required user data is provided',
      function (done) {
        api.post('/users')
          .send(userOne)
          .expect(201).end((err, res) => {
            resData = res;
            errData = err;
            if (err) {
              return done(err);
            }
            expect(res.body.user).to.have.property('username');
            expect(res.body.user).to.have.property('firstName');
            expect(res.body.user).to.have.property('lastName');
            expect(res.body.user).to.have.property('email');
            expect(res.body.user).to.have.property('password');
            done();
          });
      });

    it('should return an error for incomplete user data',
      function (done) {
        api.post('/users')
          .send({
            username: 'myname',
            email: 'thatemail@the.com',
            password: 'anything',
            lastName: 'CoolGuys'
          })
          .expect(400).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.equal('User data incomplete.');
            done();
          });
      });

    it('should validate that provided user data is valid',
      function (done) {
        if (errData) {
          return done(errData);
        }
        expect(resData.body.user.username).to.not.be.empty;
        expect(resData.body.user.firstName).to.not.be.empty;
        expect(resData.body.user.lastName).to.not.be.empty;
        expect(resData.body.user.email).to.not.be.empty;
        expect(resData.body.user.password).to.not.be.empty;
        expect(bcrypt.compareSync(userOne.password,
          resData.body.user.password)).to.be.true;
        expect(resData.body.user.RoleId).to.not.be.empty;
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

    it('should validate that a new user created is unique',
      function (done) {
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

    it('should validate that a new user created has a role',
      function (done) {
        if (errData) {
          return done(errData);
        }
        expect(resData.body.user).to.have.property('RoleId');
        expect(resData.body.user.RoleId).to.not.be.empty;
        expect(resData.body.user.RoleId).to.equal(2);
        done();
      });

    it('should validate that a new user has firstName and lastName',
      function (done) {
        if (errData) {
          return done(errData);
        }
        expect(resData.body.user).to.have.property('firstName');
        expect(resData.body.user).to.have.property('lastName');
        expect(resData.body.user.firstName).to.equal(userOne.firstName);
        expect(resData.body.user.lastName).to.equal(userOne.lastName);
        done();
      });
  });

  describe('Get users', function () {
    it('should return the user if userid matches tokenid',
      function (done) {
        api.get('/users/3').set({ 'x-access-token': userToken })
          .expect(200).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('username');
            expect(res.body).to.have.property('firstName');
            expect(res.body).to.have.property('lastName');
            expect(res.body).to.have.property('email');

            expect(res.body.id).to.equal(3);
            expect(res.body.username).to.equal('adaobi');
            expect(res.body.firstName).to.equal('Adaobi');
            expect(res.body.RoleId).to.equal(2);
            done();
          });
      });

    it('should return all users if no user-id is specified',
      function (done) {
        api.get('/users').set({ 'x-access-token': adminToken })
          .expect(200).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.lengthOf(5);
            done();
          });
      });

    it('should return an error if user is not admin', function (done) {
      api.get('/users').set({ 'x-access-token': userToken })
        .expect(401).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('You do not have permission.');
        });

      api.get('/users').expect(401).end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('No token provided.');
        done();
      });
    });

    it('should return the user with the specified user-id',
      function (done) {
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

    it('should return an error if user is not registered',
      function (done) {
        api.get('/users/4').expect(401).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('No token provided.');
          done();
        });
      });

    it('should return an error if userid does not match tokenid',
      function (done) {
        api.get('/users/4').set({ 'x-access-token': userToken })
          .expect(401).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.equal('You do not have permission to view user data.');
            done();
          });
      });

  });

  describe('Get user documents', function () {
    it('should return all user documents for admins and owners',
      function (done) {
        api.get('/users/3/documents').set({ 'x-access-token': adminToken })
          .expect(200).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.lengthOf(3);
          });
        api.get('/users/3/documents').set({ 'x-access-token': userToken })
          .expect(200).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.lengthOf(3);
            done();
          });
      });

    it('should return only users public documents for guests and other users',
      function (done) {
        api.get('/users/2/documents').set({ 'x-access-token': userToken })
          .expect(200).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.lengthOf(1);
          });
        api.get('/users/2/documents')
          .expect(200).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.lengthOf(1);
            done();
          });
      });
  });

  describe('Update user', function () {
    let newToken;
    const newUser = {
      username: 'michael',
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'micha@non.com',
      password: 'michael'
    };

    before(function (done) {
      api.post('/users').send(newUser)
        .end((err, res) => {
          newToken = res.body.token;
          done();
        });
    });

    it('should update user if tokenid matches user or admin',
      function (done) {
        api.put('/users/7').set({ 'x-access-token': adminToken })
          .send({ username: 'emmanuel' })
          .expect(200).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body.user).to.have.property('username');
            expect(res.body.user.username).to.equal('emmanuel');
          });

        api.put('/users/7').set({ 'x-access-token': newToken })
          .send({ username: 'michael' })
          .expect(200).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body.user).to.have.property('username');
            expect(res.body.user.username).to.equal('michael');
            done();
          });
      });

    it('should return an error if tokenid does not match user or admin',
      function (done) {
        api.put('/users/7').send({ username: 'emmanuel' })
          .expect(401).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.equal('No token provided.');
          });

        api.put('/users/7').set({ 'x-access-token': userToken })
          .send({ username: 'michael' })
          .expect(401).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('error');
            expect(res.body.error)
              .to.equal('You do not have permission to update user data.');
            done();
          });
      });

    it('should update user role if tokenid matches admin token',
      function (done) {
        api.put('/users/7').set({ 'x-access-token': adminToken })
          .send({ RoleId: 1 }).expect(200).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.equal('User data updated.');
            expect(res.body.user.RoleId).to.equal(1);
            done();
          });
      });

    it('should return error for user role update if tokenid does not' +
      'match admin token', function (done) {
      api.put('/users/7').set({ 'x-access-token': userToken })
        .send({ RoleId: 1 }).expect(401).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Only an admin can add admins.');
          done();
        });
    });
  })

  describe('Delete user', function () {
    let newToken;
    const delUserOne = {
      username: 'micl',
      firstName: 'Micel',
      lastName: 'Johnson',
      email: 'mich@nusn.com',
      password: 'michael'
    };
    const delUserTwo = {
      username: 'micel',
      firstName: 'Micel',
      lastName: 'Johnson',
      email: 'mich@nson.com',
      password: 'michael'
    };
    const delUserThree = {
      username: 'micoje',
      firstName: 'Micel',
      lastName: 'Johnson',
      email: 'mich@nso.com',
      password: 'michael'
    };
    before(function (done) {
      api.post('/users').send(delUserOne)
        .end((err, res) => {
        });
      api.post('/users').send(delUserTwo)
        .end((err, res) => {
          newToken = res.body.token;
        });
      api.post('/users').send(delUserThree)
        .end((err, res) => {
          done();
        });
    });

    it('should delete user if tokenid matches admin', function (done) {
      api.delete('/users/8').set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('success');
          expect(res.body.username).to.equal('micl');
          expect(res.body.success).to.equal('User data deleted.');
          done();
        });
    });

    it('should delete user if tokenid matches user', function (done) {
      api.delete('/users/9').set({ 'x-access-token': newToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('username');
          expect(res.body).to.have.property('success');
          expect(res.body.username).to.equal('micel');
          expect(res.body.success).to.equal('User data deleted.');
          done();
        });
    });

    it('should return an error if tokenid does not match user or admin',
      function (done) {
        api.delete('/users/10')
          .expect(401).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.equal('No token provided.');
          });

        api.delete('/users/10').set({ 'x-access-token': userToken })
          .expect(401).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('error');
            expect(res.body.error)
              .to.equal('You do not have permission to delete user.');
            done();
          });
      });
  })

});