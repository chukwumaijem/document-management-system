import chai from 'chai';
import supertest from 'supertest';
import app from '../../server';

const expect = chai.expect;
const api = supertest(app);

describe('Role Tests', () => {
  let adminToken;
  let userToken;

  before((done) => {
    api.post('/users/login')
      .send({ username: 'ebuka', password: 'ebukaakubu' })
      .expect(200).end((err, res) => {
        adminToken = res.body.token;
      });
    api.post('/users/login')
      .send({ username: 'adaobi', password: 'mmaduada' })
      .expect(200).end((err, res) => {
        userToken = res.body.token;
        done();
      });
  });

  describe('Create Role', () => {
    it('should add a role if role does not exist', (done) => {
      api.post('/roles').set({ 'x-access-token': adminToken })
        .send({ title: 'Editor' }).expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('success');
          expect(res.body.success)
            .to.equal('New role created successfully.');
          done();
        });
    });

    it('should not add role if it exists', (done) => {
      api.post('/roles').set({ 'x-access-token': adminToken })
        .send({ title: 'Editor' }).expect(409)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Role already exists.');
          done();
        });
    });

    it('should return error for non-admin users', (done) => {
      api.post('/roles').set({ 'x-access-token': userToken })
        .send({ title: 'Member' }).expect(401)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('You do not have permission.');
        });

      api.post('/roles').send({ title: 'Member' })
        .expect(401).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('No token provided.');
          done();
        });
    });
  });

  describe('Get Role', () => {
    let roles;
    it('should return all the roles available', (done) => {
      api.get('/roles').set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          roles = res.body;
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.lengthOf(3);
          done();
        });
    });

    it('should return at least admin and user roles', (done) => {
      expect(roles[0].title).to.equal('Admin');
      expect(roles[1].title).to.equal('User');
      done();
    });

    it('should return error for non-admin users', (done) => {
      api.get('/roles').set({ 'x-access-token': userToken })
        .expect(401).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('You do not have permission.');
        });

      api.get('/roles')
        .expect(401).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('No token provided.');
          done();
        });
    });
  });

  describe('Update role', () => {
    it('should update existing roles', (done) => {
      api.put('/roles/2').set({ 'x-access-token': adminToken })
        .send({ title: 'Reader' }).expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal('Role updated successfully.');
          done();
        });
    });

    it('should return approprite message for roles that do not exist',
      (done) => {
        api.put('/roles/4').set({ 'x-access-token': adminToken })
          .send({ title: 'Newbie' }).expect(404)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.equal('Role does not exist.');
            done();
          });
      });


    it('should return error for non-admin users', (done) => {
      api.put('/roles/2').set({ 'x-access-token': userToken })
        .send({ title: 'Member' }).expect(401)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('You do not have permission.');
        });

      api.put('/roles/2').send({ title: 'Member' })
        .expect(401).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('No token provided.');
          done();
        });
    });
  });

  describe('Delete Role', () => {
    it('should delete existing roles', (done) => {
      api.delete('/roles/3').set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('success');
          expect(res.body.success)
            .to.equal('Role was deleted successfully.');
          done();
        });
    });

    it('should return approprite message for roles that do not exist',
      (done) => {
        api.delete('/roles/4').set({ 'x-access-token': adminToken })
          .expect(404).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.equal('Role does not exist.');
            done();
          });
      });

    it('should return error for non-admin users', (done) => {
      api.delete('/roles/3').set({ 'x-access-token': userToken })
        .expect(401).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('You do not have permission.');
        });

      api.delete('/roles/3')
        .expect(401).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('No token provided.');
          done();
        });
    });
  });
});
