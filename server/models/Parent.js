const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ParentSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'parent',
    },
});

// Hash the password before saving the user model
// Hash the password before saving the user model
ParentSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
  
  // Pre-save hook to hash passwords before saving
  ParentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

module.exports = mongoose.model('Parent', ParentSchema);
