import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const EventsSchema = new mongoose.Schema({
  name_event: {
    type: String,
    required: true
  },
  id_admin_event: {
    type: String,
    required: true
  },
  information: {
    type: String,
    default: 'Information Event'
  },
  address: {
    type: String,
    default: 'address event'
  },
  client_confirmation: {
    type: Array,
    default: []
  },
  lat: {
    type: String,
    default: '-23.533773'
  },
  long: {
    type: String,
    default: '-46.625290'
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

EventsSchema.plugin(mongoosePaginate);

mongoose.model('Events', EventsSchema);
