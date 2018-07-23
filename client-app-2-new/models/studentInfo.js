var mongoose = require('mongoose');
 
var studentInfoSchema = new mongoose.Schema({
    
     _id: mongoose.Schema.Types.ObjectId,
    Name: String,
    Roll_No:String,
    Registration_No:String,
    Subject1:String,
    Subject2:String,
    Subject3:String,
    Subject4:String,
    Subject5:String,
   
   
});
 
module.exports  = mongoose.model('studentInfo', studentInfoSchema);
 
