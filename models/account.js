const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const Account = new Schema({
       admin:   {
        type: Boolean,
        default: false
    }
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);
