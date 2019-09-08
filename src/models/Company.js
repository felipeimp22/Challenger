import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cnpj_or_cpf: {
    type: Number,
    required: true
  },
  admin: {
    type: Boolean,
    default: true
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

CompanySchema.plugin(mongoosePaginate);

mongoose.model('Company', CompanySchema);
