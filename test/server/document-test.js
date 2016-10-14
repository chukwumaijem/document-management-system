const app = require('../../server'),
  expect = require('chai').expect,
  supertest = require('supertest'),
  api = supertest(app);

describe('Documents Test Suite', function () {

  describe('Create Documents', function () {
    it('should create a published date for document', function (done) {
      api.post('/document').send()
        .expect(201).end((err, res) => {
          expect(res.body).to.have.property('publishedDate');
          expect(res.body.createdAt).to.not.be.empty;
        });
      done();
    });
  });

  describe('Get Documents', function () {
    it('should return documents using specified limit', function (done) {
      api.get('/documents/query?limit=5')
        .expect(200).end((err, res) => {
          expect(res.body).to.have.lengthOf(5);
          expect(res.body[0].id).to.equal(1);
          expect(res.body[4].id).to.equal(5);
        });
      done();
    });

    it('should return documents using specified limit and starting point', function (done) {
      api.get('/documents/query?limit=5&start=4')
        .expect(200).end((err, res) => {
          expect(res.body).to.have.length.within(0, 5);
          expect(res.body[0].id).to.equal(3);
        });

      api.get('/documents/query?limit=5&start=15')
        .expect(200).end((err, res) => {
          expect(res.body).to.have.lengthOf(0);
        });
      done();
    });

    it('should return documents in the order of published date', function (done) {
      api.get('/documents/query?limit=5')
        .expect(200).end((err, res) => {
          expect(res.body[0].publishedDate).to.be.below(res.body[1].publishedDate);
          expect(res.body[1].publishedDate).to.be.below(res.body[2].publishedDate);
          expect(res.body[2].publishedDate).to.be.below(res.body[3].publishedDate);
          expect(res.body[3].publishedDate).to.be.below(res.body[4].publishedDate);
        });
      done();
    })
  });
});