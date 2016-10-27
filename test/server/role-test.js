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
          if (err) return done(err);
          done();
        });
    });

    it('should not add the role if exists', function (done) {
      api.post('/roles').send('Editor')
        .expect(200).end((err, res) => {
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Role already exists.');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Get Role', function () {
    it('should return all the roles available', function (done) {
      api.get('/roles')
        .expect(200).end((err, res) => {
          expect(res.body).to.have.lengthOf(4);
          if (err) return done(err);
          done();
        });
    });

    it('should return the number of people in a particular role', function (done) {
      api.get('/roles/admin')
        .expect(200).end((err, res) => {
          expect(res.body).to.have.property('population');
          expect(res.body.population).to.equal(2);
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Update role', function () {
    it('should update existing roles', function (done) {
      api.put('/roles').send({ oldRole: 'Observer', newRole: 'Reader' })
        .expect(200).end((err, res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal('Role was created successfully.');
          if (err) return done(err);
          done();
        });
    });

    it('should return approprite message for roles that do not exist', function (done) {
      api.put('/roles').send({ oldRole: 'Returnee', newRole: 'Newbie' })
        .expect(301).end((err, res) => {
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Role does not exist.');
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Delete Role', function () {
    it('should delete existing roles', function (done) {
      api.delete('/roles').send('Reader')
        .expect(200).end((err, res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal('Role was deleted successfully.');
          if (err) return done(err);
          done();
        });
    });

    it('should return approprite message for roles that do not exist', function (done) {
      api.delete('/roles').send('Employee')
        .expect(301).end((err, res) => {
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Role does not exist.');
          if (err) return done(err);
          done();
        });
    });
  })
});