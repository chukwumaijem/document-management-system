const app = require('../../server');
const expect = require('chai').expect;
const supertest = require('supertest');

const api = supertest(app);

describe('Documents Test Suite', () => {
  let adminToken;
  let userToken;

  before((done) => {
    api.post('/users/login').send({ username: 'ebuka', password: 'ebukaakubu' })
      .expect(200).end((err, res) => {
        adminToken = res.body.token;
      });

    api.post('/users/login').send({ username: 'adaobi', password: 'mmaduada' })
      .expect(200).end((err, res) => {
        userToken = res.body.token;
        done();
      });
  });

  describe('Get Documents', () => {
    it('should return all the documents for an admin', (done) => {
      api.get('/documents').set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.lengthOf(8);
          done();
        });
    });

    it('should return users documents and other piblic documents' +
      ' for registered users', (done) => {
      api.get('/documents').set({ 'x-access-token': userToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.lengthOf(3);
          done();
        });
    });

    it('should return all only public documents for guests', (done) => {
      api.get('/documents').expect(200).end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).to.be.instanceof(Array);
        for (let i = 0; i < res.body.length; i += 1) {
          expect(res.body[i].public).to.be.true;
        }
        expect(res.body).to.have.lengthOf(2);
        done();
      });
    });

    it('should return documents using specified limit', (done) => {
      api.get('/documents/query?limit=5')
        .set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.length.of.at.most(5);
          for (let i = 0; i < res.body.length - 1; i += 1) {
            expect(res.body[i].id).to.be
              .above(res.body[i + 1].id);
          }
          done();
        });
    });

    it('should return documents using specified limit and starting point',
      (done) => {
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

    it('should return documents in the order of published date' +
      ' from most recent', (done) => {
      api.get('/documents/query?limit=5')
        .set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          for (let i = 0; i < res.body.length - 1; i += 1) {
            expect(res.body[i].createdAt).to.be.at
              .least(res.body[i + 1].createdAt);
          }
          done();
        });
    });

    it('should return a 404 for documents that do not exist', (done) => {
      api.get('/documents/223')
        .expect(404).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Document not found.');
          done();
        });
    });

    it('should return specified private document for the owner', (done) => {
      api.get('/documents/3').set({ 'x-access-token': userToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body[0].ownerId).to.equal(3);
          expect(res.body[0].public).to.be.false;
          done();
        });
    });

    it('should return specified private document for an admin', (done) => {
      api.get('/documents/3').set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body[0].owner.RoleId).to.not.equal(1);
          expect(res.body[0].public).to.be.false;
          done();
        });
    });

    it('should return error for guests on private documents', (done) => {
      api.get('/documents/3')
        .expect(401).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error)
            .to.equal('You do not have permission to view this document.');
          done();
        });
    });


    it('should return public document for all users', (done) => {
      api.get('/documents/4').set({ 'x-access-token': adminToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body[0].ownerId).to.not.equal(1);
          expect(res.body[0].public).to.be.true;
        });
      api.get('/documents/4').set({ 'x-access-token': userToken })
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body[0].ownerId).to.not.equal(3);
          expect(res.body[0].public).to.be.true;
        });
      api.get('/documents/4')
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body[0].public).to.be.true;
          done();
        });
    });

    it('should return only public documents for guests', (done) => {
      api.get('/documents')
        .expect(200).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.lengthOf(2);
          done();
        });
    });
  });

  describe('Create Documents', () => {
    const docOne = {
      title: 'My test document',
      content: 'A document for my tests',
      RoleId: 2,
      ownerId: 1
    };
    const docTwo = {
      title: 'My test document',
      content: 'A document for my tests',
      RoleId: 2,
      ownerId: 3
    };

    it('should create a document for a registered user', (done) => {
      api.post('/documents').set({ 'x-access-token': adminToken })
        .send(docOne).expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('createdAt');
          expect(res.body.createdAt).to.not.be.empty;
          done();
        });
    });

    it('should not create document an unregistered user', (done) => {
      api.post('/documents').send(docTwo)
        .expect(401).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('No token provided.');
          done();
        });
    });

    it('should create a published date for document', (done) => {
      api.post('/documents').set({ 'x-access-token': userToken })
        .send(docTwo).expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('createdAt');
          expect(res.body.createdAt).to.not.be.empty;
          done();
        });
    });
  });

  describe('Update document', () => {
    it('should update document if tokenid matches user or admin',
      (done) => {
        api.put('/documents/3').set({ 'x-access-token': adminToken })
          .send({ title: 'Edited by admin.' }).expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('success');
            expect(res.body.success)
              .to.equal('Document successfully updated.');
          });

        api.put('/documents/3').set({ 'x-access-token': userToken })
          .send({ title: 'Edited by user.' }).expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('success');
            expect(res.body.success)
              .to.equal('Document successfully updated.');
            done();
          });
      });

    it('should return an error if user is guest not the owner',
      (done) => {
        api.put('/documents/4').set({ 'x-access-token': userToken })
          .send({ title: 'Can I edit?' }).expect(401)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('error');
            expect(res.body.error).to
              .equal('You do not have permission to update this document.');
          });

        api.put('/documents/4').send({ title: 'Can I edit?' })
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

  describe('Delete document', () => {
    it('should delete document if token matches admin or owner token',
      (done) => {
        api.delete('/documents/7').set({ 'x-access-token': adminToken })
          .expect(200).end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.equal('Document deleted.');
            done();
          });
      });

    it('should return error if user not owner or is guest', (done) => {
      api.delete('/documents/4').set({ 'x-access-token': userToken })
        .expect(401).end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('error');
          expect(res.body.error).to
            .equal('You do not have permission to delete this document.');
        });

      api.delete('/documents/4')
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
