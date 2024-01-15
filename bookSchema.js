const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://its0ll13:Password1234@libarydb.ndilym7.mongodb.net/");
const bookSchema =  new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    genre :{ 
        type : String,
        require : true
    },
    available : {
        type : Boolean,
        require : true
    },
    description :{
        type : String,
        require : true
    },
    url : {
        type: String,
        require : true
    }

});
const Books = new mongoose.model("Books", bookSchema);
module.exports = { Books, bookSchema };
