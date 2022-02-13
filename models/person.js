const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /(^\d{2}-?\d{6,})|(^\d{3}-?\d{5,})/.test(value);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});
/* eslint no-param-reassign: off */
/* eslint no-underscore-dangle: off */
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
