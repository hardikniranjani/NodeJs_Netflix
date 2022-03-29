const mongoose = require('mongoose');



const companySchema = new mongoose.Schema({
    _id: {
        type : Number,
        required : true
    },
    Name : {
        type: String,
        required : true,
    },
    Origin_country : {
        type: String,
        required : true
    },
    Founded:{
        type:String,
        required : true
    },
    Founders:{
        type:[String],
        required : true
    },
    CEO:{
        type: String,
    },
    Address:{
        type: String,
        required : true
    },
    Headquaters : {
        type : [String]
    },
    Description : {
        type :String
    },
    Value:{
        type: String
    },
    IsActive: {
        type: Boolean,
        default: true
    }
});


const company = mongoose.model("Companies",companySchema);

module.exports = company;