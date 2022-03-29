const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  Name: {
    type: String,
  },
  Email: {
    type: String,
    lowercase: true,
  },
  Contact_Number: {
    type: String,
  },
  Gender : {
    type : String
  },
  Password: {
    type: String,
  },
  Role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  Payment_ID : {
    type : String,
  },
  Order_ID : {
    type : String
  },
  Plan_Purchase_Date_Time: {
    type: Date,
  },
  Plan_Expiry_Date_Time: {
    type: Date,
  },
  Subscription_plan_id: {
    type: Number,
    ref: "Subscription",
    default: null,
  },
  watchHistory: {
    type: String,
    ref: "watchHistory",
  },
  watchLater: {
    type: String,
    ref: "watchLater",
  },
  wishlist: {
    type: String,
    ref: "wishlist",
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
});

const UserModel = mongoose.model("users", userSchema);

function userValidation() {
  const schema = Joi.object({
    _id: Joi.number(),
    Name: Joi.string().max(25).required(),
    Email: Joi.string().email().required(),
    Password: Joi.string().max(25).required(),
  });

  return schema.validate();
}

module.exports = { UserModel, userValidation };
