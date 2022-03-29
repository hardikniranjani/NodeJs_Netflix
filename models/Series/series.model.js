const mongoose = require("mongoose");

const seriesSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  SeriesName: {
    type: String,
  },
  Original_language: {
    type: String,
  },
  Spoken_languages: {
    type: [Number],
    ref: "Language",
  },
  Description: {
    type: String,
  },
  Genres: {
    type: [Number],
    ref: "genres",
  },
  Number_of_episodes:{
    type: Number,
  },
  Number_of_seasons:{
    type: Number,
  },
  ReleaseDate: {
    type: Date,
  },
  Popularity: {
    type: Number,
  },
  Banner:{
    type: String,
  },
  backdrop_path:{
    type: String,
  },
  Production_companies: {
    type: [Number],
    ref: "Companies",
  },
  Seasons: {
    type: [Number],
    ref: "seasons",
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

const Series = mongoose.model("series", seriesSchema);

module.exports = Series;
