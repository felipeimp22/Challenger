import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cpf: {
    type: Number,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.plugin(mongoosePaginate);

mongoose.model('User', UserSchema);
