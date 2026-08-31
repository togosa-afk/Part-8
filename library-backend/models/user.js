const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  favoriteGenre: {
    type: String,
    required: true,
    default: 'Unknown'
  },
  password: {
    type: String,
    default: () => bcrypt.hashSync('secret', 10)
  }
})

module.exports = mongoose.model('User', schema)