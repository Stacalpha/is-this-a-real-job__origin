import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;
chai.use(chaiHttp);

const upvoteBaseUrl = '/api/v1/invites/upvote';

describe('UPVOTE CONTROLLER', () => {
  describe('PATCH UPVOTE INVITE', () => {
    it('it should upvote a post and increment upvote count', (done) => {
      chai.request(app)
        .patch(`${upvoteBaseUrl}/90`)
        .end((error, res) => {
          expect(res).to.have.status(200);
          expect(res.body.payload).to.have.property('upVotes');
          done();
        });
    });

    it('it should return 404 on resource not found', (done) => {
      chai.request(app)
        .patch(`${upvoteBaseUrl}/MaLf90rMeD_iD`)
        .end((error, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('Job Invite not found');
          done();
        });
    });

    it('it should return 400 if inviteId missing', (done) => {
      chai.request(app)
        .patch(`${upvoteBaseUrl}`)
        .end((error, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('Bad Request');
          done();
        });
    });
  });
});