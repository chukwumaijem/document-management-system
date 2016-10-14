const app = require('../../server.js'),
  expect = require('chai').expect,
  supertest = require('supertest'),
  api = supertest(app);

describe('Role Tests', function () {
  describe('Create Role', function () {
    it('should add a role if role does not exist', function (done) {
      api.post('/roles').send({ title: 'Editor' })
        .expect(200).end((err, res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal('New role created successfully.');
        });
      done();
    });

    it('should not add the role if exists', function (done) {
      api.post('/roles').send('Editor')
        .expect(200).end((err, res) => {
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Role already exists.');
        });
      done();
    });
  });

  describe('Get Role', function () {
    it('should return all the roles available', function (done) {
      api.get('/roles')
        .expect(200).end((err, res) => {
          expect(res.body).to.have.lengthOf(4);
        });
      done();
    });

    it('should return the number of people in a particular role', function (done) {
      api.get('/roles/admin')
        .expect(200).end((err, res) => {
          expect(res.body).to.have.property('population');
          expect(res.body.population).to.equal(2);
        });
      done();
    });
  });
});