const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  SeasonName: {
    type: String,
  },
  SeasonNumber: {
    type: Number,
    min: 1,
  },
  SeriesID: {
    type: Number,
    ref: "series",
  },
  Description: {
    type: String,
  },
  Number_of_episodes: {
    type: Number,
  },
  Banner: {
    type: String,
  },
  Episodes: {
    type: [Number],
    ref: "episode",
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
});

const Season = new mongoose.model("seasons", seasonSchema);

module.exports = Season;
