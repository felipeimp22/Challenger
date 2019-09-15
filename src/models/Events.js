import mongoose, { mongo } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { type } from 'os';
const Schema = mongoose.Schema;

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  }
});

const EventsSchema = new mongoose.Schema({
  name_event: {
    type: String,
    required: true
  },
  list: [ListSchema],
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

  config: [{
    type: String,
  }
  ],
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
