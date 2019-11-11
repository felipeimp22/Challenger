import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';


const phoneList = new mongoose.Schema({
  DDD: {
    type: Number,
  },
  number: {
    type: Number
  }
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  list: [phoneList],
  deleted: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
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
