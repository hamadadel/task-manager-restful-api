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
  //   age: {
  //     type: Number,
  //     default: 0,
  //     validate(value) {
  //       if (value < 0) throw new Error('Age must be a positive number');
  //     },
  //   },
  password: {
    type: String,
    minlength: 8,
    trim: true,
    required: true,
    validate(value) {
      if (value.includes('password'))
        throw new Error('Password must be strong');
    },
  },
});

const me = new User({
  name: '    Andrew mead    ',
  age: 27,
  email: '     andrew@gmail.com     ',
  password: 'strong_pass      ',
})
  .save()
  .then((me) => console.log(me))
  .catch((error) => console.log('Error', error));
