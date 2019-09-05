const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  name: String,
  description: String,
  videoId: String
})

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;