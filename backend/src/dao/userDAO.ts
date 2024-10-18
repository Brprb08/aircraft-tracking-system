import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],  // Basic email validation
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',  // default role
    enum: ['user', 'admin'],  // Limit roles to 'user' and 'admin'
  }
}, { timestamps: true, collection: 'users' });  // Automatically add createdAt and updatedAt fields

const User = mongoose.model('User', userSchema);

export default User;