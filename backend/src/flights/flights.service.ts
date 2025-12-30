import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { PaginatedResponse } from '../common/dto/response.dto';

@Injectable()
export class FlightsService {
  constructor(@InjectModel('Flight') private flightModel: Model<any>) {}

  async search(searchDto: SearchFlightsDto): Promise<PaginatedResponse<any>> {
    const {
      departure,
      arrival,
      departureDate,
      returnDate,
      passengers,
      page = 1,
      limit = 10,
    } = searchDto;

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {
      'departure.code': departure,
      'arrival.code': arrival,
      isActive: true,
    };

    // Add date range filter
    if (departureDate) {
      const startDate = new Date(departureDate);
      const endDate = new Date(departureDate);
      endDate.setDate(endDate.getDate() + 1);

      query['departure.time'] = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    // Find flights
    const [flights, total] = await Promise.all([
      this.flightModel.find(query).skip(skip).limit(limit).exec(),
      this.flightModel.countDocuments(query),
    ]);

    return new PaginatedResponse(flights, total, page, limit);
  }

  async findById(id: string): Promise<any> {
    const flight = await this.flightModel.findById(id);
    if (!flight) {
      throw new NotFoundException('Flight not found');
    }
    return flight;
  }

  async create(createFlightDto: any): Promise<any> {
    const flight = new this.flightModel(createFlightDto);
    return flight.save();
  }

  async update(id: string, updateFlightDto: any): Promise<any> {
    const flight = await this.flightModel.findByIdAndUpdate(id, updateFlightDto, {
      new: true,
    });
    if (!flight) {
      throw new NotFoundException('Flight not found');
    }
    return flight;
  }

  async delete(id: string): Promise<void> {
    const result = await this.flightModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Flight not found');
    }
  }

  async getFlightsByAirline(airline: string): Promise<any[]> {
    return this.flightModel.find({ airline, isActive: true });
  }

  async getAvailableFlights(
    departure: string,
    arrival: string,
    date: Date,
  ): Promise<any[]> {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    return this.flightModel.find({
      'departure.code': departure,
      'arrival.code': arrival,
      'departure.time': {
        $gte: startDate,
        $lt: endDate,
      },
      isActive: true,
    });
  }
}
