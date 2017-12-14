const should = require("should");
const mongoose = require('mongoose');
const Account = require("../models/account.js");

describe('Account', () => {
	
	//testing the db 
    before((done) => {
        const db = mongoose.connect('mongodb://prabhu:prabhu@ds139436.mlab.com:39436/login1', { useMongoClient: true });
        done();
    });
	
	//close the db connection after the process is getting completed
    after((done) => {
        mongoose.connection.close();
        done();
    });
	
	//test the user login and registration
    beforeEach( (done) => {
        var account = new Account({
            username: '12345',
            password: 'testy'
        });

        account.save((error) => {
            if (error) console.log('error' + error.message);
            else console.log('no error');
            done();
        });
    });

    it('find a user by username', (done) => {
        Account.findOne({ username: '12345' }, (err, account) => {
            account.username.should.eql('12345');
            console.log("   username: ", account.username);
            done();
        });
    });

    afterEach((done) => {
        Account.remove({}, () => {
            done();
        });
     });

});
