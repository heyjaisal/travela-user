const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: [
      'concert', 'conference', 'workshop', 'seminar', 'meetup', 'party', 
      'festival', 'wedding', 'webinar', 'charity-event', 'other'
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  eventVenue: {
    type: String,
    required: true,
    trim: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  eventDateTime: {
    type: Date,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  features: [{
    text: {
      type: String,
      required: true,
      trim: true,
    },
  }],
  image:{
    type: String,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Host',  
    required: true,
  },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
