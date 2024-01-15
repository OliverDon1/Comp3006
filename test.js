async function tests() {
    const chai = await import('chai');
    const chaiHttp = require('chai-http');
    const app = require('.app.js');
    
    chai.use(chaiHttp);
    const { expect } = chai;
    
    describe('Server API tests', () => {
        it('should return a list of accounts', (done) => {
            chai.request(app)
                .get('/getAccounts')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
        it('should update an existing account', async () => {
            const response = await chai.request(app)
                .post('/changeAccount')
                .send({ username: 'testuser', password: 'newpassword', CRB: ['book1', 'book2'] });
            expect(response).to.have.status(200);
            expect(response.body).to.have.property('message').that.includes('Account updated successfully');
        });
        it('should get a list of books', async () => {
            const response = await chai.request(app).get('/getBooks');
            expect(response).to.have.status(200);
            expect(response.body).to.be.an('array');
        });
    });

};
tests();
