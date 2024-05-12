require('./mongoose.js');
const { model } = require('mongoose');
const validator = require('validator');

const User = model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('Email is invalid');
    },
  },
  password: {
    type: String,
    minlength: 8,
    trim: true,
    required: true,
    validate(value) {
      if (value.toLowerCase().includes('password'))
        throw new Error('Password must be strong');
    },
  },
});

module.exports = User;
