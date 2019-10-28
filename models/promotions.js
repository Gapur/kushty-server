const mongoose = require('mongoose');
const mongooseCurrency = require('mongoose-currency');

mongooseCurrency.loadType(mongoose);

const { Currency } = mongoose.Types;

const { Schema } = mongoose;

const promotionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  price: {
    type: Currency,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Promotion', promotionSchema);
