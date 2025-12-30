import { Schema } from 'mongoose';

export const AccommodationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    type: {
      type: String,
      enum: ['hotel', 'apartment', 'villa', 'cottage', 'resort', 'hostel'],
      required: true,
    },
    location: {
      address: String,
      city: String,
      country: String,
      latitude: Number,
      longitude: Number,
      zipCode: String,
    },
    images: [String],
    amenities: [String],
    rooms: {
      total: Number,
      available: Number,
      types: [
        {
          type: String,
          count: Number,
          basePrice: Number,
        },
      ],
    },
    pricing: {
      basePrice: Number,
      currency: {
        type: String,
        default: 'EUR',
      },
      seasonalPrices: [
        {
          startDate: Date,
          endDate: Date,
          pricePercentage: Number,
        },
      ],
    },
    rating: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    policies: {
      checkInTime: String,
      checkOutTime: String,
      cancellation: String,
      minStay: Number,
    },
    owner: {
      id: String,
      name: String,
      email: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
