const { Schema, model } = require('mongoose');
const validator = require('validator');
const { hash, compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new Schema(
  {
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
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

// Methods which accessible on the instances of that model
userSchema.methods.generateAuthToken = async function () {
  const token = sign({ _id: this._id.toString() }, 'secret_key');
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

// Hiding the password and tokens properties [this function toJSON() get called whenever and object get stringified]
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
};

// Static methods all accessible on the model class itself
userSchema.statics.authenticate = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Unable to authenticate');
  const isPasswordMatch = await compare(password, user.password);
  if (!isPasswordMatch) throw new Error('Wrong credentials');
  return user;
};
/**
 * Middlewares
 */
// Hash user password on save
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 8);
  }
  next();
});

userSchema.pre('findOneAndDelete', async function (next) {
  await Task.deleteMany({ owner: this.getQuery()._id });
  next();
});
const User = model('User', userSchema);

module.exports = User;
