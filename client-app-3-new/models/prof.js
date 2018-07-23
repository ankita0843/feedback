var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var ProfSchema = new mongoose.Schema({
    username: String,
    email: String,
    profId:String,
    password: String,
    department: String,
    full_name: String,
    created_forms: [String]
});

ProfSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", ProfSchema);