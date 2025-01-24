const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required, boss'],
      maxLength: [30, 'Name cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required, boss'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address, boss',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required, boss'],
      minLength: [6, 'Password must be at least 6 characters'],
      validate: {
        validator: function (value) {
          // Prevent overly simple passwords
          return value !== '123456';
        },
        message: 'Your password is too easy, boss! Make it cooler!',
      },
    },
    role: {
      type: Number,
      default: 0, // 0 = User, 1 = Admin (you can expand this if needed)
    },
  },
  { timestamps: true }
);

// **Encrypting password before saving**
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  // Hash the password with bcrypt
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// **Compare user password**
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// **Generate JWT token**
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1h' } // Use env variable for expiration
  );
};

// **Export User model**
const User = mongoose.model('User', userSchema);

module.exports = User;
