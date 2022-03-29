const mongoose = require('mongoose');

const watchLaterSchema = new mongoose.Schema({
    User: {
        type: Number,
        ref: 'users'
    },
    Movies: {
        type: [Number],
        ref: 'Movies'
    },
    Episode:{
        type: [Number],
        ref: 'episode'
    },
    IsActive: {
        type: Boolean,
        default: true,
      },
})

const watchLater = mongoose.model('watchLater',watchLaterSchema);

module.exports = watchLater;