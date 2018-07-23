var mongoose = require('mongoose');
 
var profInfoSchema = new mongoose.Schema({
    
     _id: mongoose.Schema.Types.ObjectId,
    Name: String,
   ProfId:String,
    Subject1:String,
    Subject2:String,
    Subject3:String,
    Subject4:String,
   
   
});
 
module.exports  = mongoose.model('profInfo', profInfoSchema);
 
