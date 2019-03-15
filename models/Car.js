const mongoose = require('mongoose')


const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'
let carSchema = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.String, required: true },
  image: { type: mongoose.Schema.Types.String, required: true },
  price: { type: Number, required: true },
  year: { type: Number, required: true },
  likes: [{type: mongoose.Schema.Types.String}],
})

let Car = mongoose.model('Car', carSchema)

module.exports = Car