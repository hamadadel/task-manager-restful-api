const { Schema, model } = require('mongoose');
const validator = require('validator');
const { hash, compare } = require('bcryptjs');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    index: true,
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

userSchema.statics.authenticate = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Unable to authenticate');
  const isPasswordMatch = await compare(password, user.password);
  if (!isPasswordMatch) throw new Error('Wrong credentials');
  return user;
};
// Hash user password on save
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 8);
    console.log(this.password);
  }
  next();
});
const User = model('User', userSchema);

module.exports = User;
