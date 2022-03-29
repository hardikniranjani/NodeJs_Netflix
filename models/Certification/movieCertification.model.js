const mongoose = require("mongoose");

const movieCertificaionSchema = new mongoose.Schema({
    _id : {
      type : Number,
      required : true
    },
    Country_id : {
      type : Number,
      ref : 'Country',
      required : true
    },
    Certification : {
      type:String,
      required : true
    },
    Meaning : {
      type : String,
      required: true
    },
    Order : {
      type : Number,
      required : true
    },
    IsActive: {
      type: Boolean,
      default: true,
    }
});

const movieCertificaion = mongoose.model(
  "MovieCertification",
  movieCertificaionSchema
);

module.exports = movieCertificaion;
