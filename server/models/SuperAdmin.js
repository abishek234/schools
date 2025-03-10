const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SuperAdminSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
    role: {
        type: String,
        default: 'superAdmin',
    },

});

// Pre-save hook to hash passwords before saving
SuperAdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
SuperAdminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('SuperAdmin', SuperAdminSchema);
