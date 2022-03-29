const mongoose = require("mongoose");

const tvCertificaionSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  Country_id: {
    type: Number,
    ref: "Country",
    required: true,
  },
  Certification: {
    type: String,
    required: true,
  },
  Meaning: {
    type: String,
    required: true,
  },
  Order: {
    type: Number,
    required: true,
  },
  IsActive: {
    type: Boolean,
    default: true,
  }
});

const tvCertificaion = mongoose.model(
  "TvCertification",
  tvCertificaionSchema
);

module.exports = tvCertificaion;
