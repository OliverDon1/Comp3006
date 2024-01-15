const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://its0ll13:Password1234@libarydb.ndilym7.mongodb.net/");
const accountSchema =  new mongoose.Schema({
    username : {
        type : String,
        require : true
    },
    password :{ 
        type : String,
        require : true
    },
    CRB : [String]
});
const Accounts = new mongoose.model("Accounts", accountSchema);
module.exports = { Accounts, accountSchema };
