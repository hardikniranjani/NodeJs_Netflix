const mongoose = require('mongoose');


const CountrySchema = new mongoose.Schema(({
        _id:{
            type:Number,
            required : true
        },
        CountryName:{
            type:String,
            minlength:2,
            maxlength:30
        },
        CountryShortForm:{
            type:String,
            minlength:2,
            maxlength:5
        },
        CountryCode : {
            type : Number,
            minlength : 1,
            maxlength : 4
        },
        IsActive: {
            type: Boolean,
            default: true,
          }
})) 


const country = mongoose.model('Country', CountrySchema);

module.exports = country;