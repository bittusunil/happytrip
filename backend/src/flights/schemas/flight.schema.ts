import { Schema } from 'mongoose';

export const FlightSchema = new Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
    },
    airline: {
      type: String,
      required: true,
    },
    departure: {
      airport: String,
      code: String,
      time: Date,
      terminal: String,
    },
    arrival: {
      airport: String,
      code: String,
      time: Date,
      terminal: String,
    },
    aircraft: {
      type: String,
      required: true,
    },
    duration: Number, // in minutes
    stops: {
      type: Number,
      default: 0,
    },
    availableSeats: {
      economy: Number,
      business: Number,
      firstClass: Number,
    },
    pricing: {
      economy: Number,
      business: Number,
      firstClass: Number,
    },
    currency: {
      type: String,
      default: 'EUR',
    },
    amenities: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
