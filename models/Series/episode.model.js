const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  EpisodeName: {
    type: String,
  },
  EpisodeNumber: {
    type: Number,
    min: 1,
  },
  ShortDescription: {
    type: String,
  },
  SeriesID: {
    type: Number,
    ref: "series",
  },
  SeasonID: {
    type: Number,
    ref: "seasons",
  },
  ReleaseDate : {
    type : Date
  },
  Banner: {
    type: String,
  },
  Video_path: {
    type: String,
  },
  Vote_average: {
    type: Number,
  },
  Vote_count: {
    type: Number,
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
});

const Episode = new mongoose.model("episode", episodeSchema);

module.exports = Episode;
