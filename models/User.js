const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Please enter a username.'],
    unique: [true, 'This username has already been taken.'],
    trim: true 
  },
  email: {
    type: String,
    required: [true, 'Please enter an email.'],
    unique: [true, 'This email already exists.'],
    match: [/.+@.+\..+/, 'Must match an email address.']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minLength: 6
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  githubId: { type: String, unique: true }
});

userSchema.pre("save", async function(next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds)
  }

  next();
});

userSchema.methods.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

mongoose.set('runValidators', true);

const User = mongoose.model('User', userSchema);

module.exports = User;