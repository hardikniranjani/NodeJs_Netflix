const mongoose = require("mongoose");
const mediaSchema = new mongoose.Schema({
  _id: Number,
  duration: {
    type: Number,
    default: 0,
  },
});
const watchHistorySchema = new mongoose.Schema({
  User: {
    type: Number,
    ref: "users",
  },
  Movies: [
    {
      _id: {
        type: Number,
        refs: "Movies",
      },
      duration: {
        type: Number,
        default: 0,
      },
    },
  ],
  Episode: [
    {
      _id: {
        type: Number,
        refs: "episode",
      },
      duration: {
        type: Number,
        default: 0,
      },
    },
  ],
  IsActive: {
    type: Boolean,
    default: true,
  },
});

const watchHistory = mongoose.model("watchHistory", watchHistorySchema);

module.exports = watchHistory;
