const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  matricNumber: {
    type: String,
    unique: true,
    required: function () { return this.role === "student"; },
    sparse: true  // Allows multiple null values
  },
  email: {
    type: String,
    unique: true,
    required: function () { return this.role === "admin"; },
    sparse: true  // Allows multiple null values
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],  // Ensures only 'student' or 'admin' roles are used
    required: true
  }
}, 
{ timestamps: true });


// // Validation middleware
// userSchema.pre('validate', function(next) {
//   if (this.role === 'student' && !this.matricNumber) {
//     this.invalidate('matricNumber', 'Matric number is required for students');
//   }
  
//   if (this.role === 'admin' && !this.email) {
//     this.invalidate('email', 'Email is required for admins');
//   }
  
//   next();
// });

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
