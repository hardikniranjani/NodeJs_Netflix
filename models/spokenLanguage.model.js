const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema(({
        _id:{
            type:Number,
        },
        Spoken_Language:{
            type:String,
            minlength:2,
            maxlength:30,
            required: true
        },
        IsActive : {
            type : Boolean,
            default : true
        }
})) 


const spoken_language = mongoose.model("Language", languageSchema);

module.exports = spoken_language;