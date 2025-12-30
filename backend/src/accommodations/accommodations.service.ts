import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchAccommodationsDto } from './dto/search-accommodations.dto';
import { PaginatedResponse } from '../common/dto/response.dto';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectModel('Accommodation') private accommodationModel: Model<any>,
    @InjectModel('Review') private reviewModel: Model<any>,
  ) {}

  async search(searchDto: SearchAccommodationsDto): Promise<PaginatedResponse<any>> {
    const { city, checkInDate, checkOutDate, guests, page = 1, limit = 10 } = searchDto;

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {
      'location.city': city,
      isActive: true,
    };

    // Find accommodations
    const [accommodations, total] = await Promise.all([
      this.accommodationModel.find(query).skip(skip).limit(limit).exec(),
      this.accommodationModel.countDocuments(query),
    ]);

    return new PaginatedResponse(accommodations, total, page, limit);
  }

  async findById(id: string): Promise<any> {
    const accommodation = await this.accommodationModel.findById(id);
    if (!accommodation) {
      throw new NotFoundException('Accommodation not found');
    }

    // Get reviews
    const reviews = await this.reviewModel.find({ accommodationId: id });

    return {
      ...accommodation.toObject(),
      reviews,
    };
  }

  async create(createAccommodationDto: any): Promise<any> {
    const accommodation = new this.accommodationModel(createAccommodationDto);
    return accommodation.save();
  }

  async update(id: string, updateAccommodationDto: any): Promise<any> {
    const accommodation = await this.accommodationModel.findByIdAndUpdate(
      id,
      updateAccommodationDto,
      { new: true },
    );
    if (!accommodation) {
      throw new NotFoundException('Accommodation not found');
    }
    return accommodation;
  }

  async delete(id: string): Promise<void> {
    const result = await this.accommodationModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Accommodation not found');
    }
  }

  async getByCity(city: string): Promise<any[]> {
    return this.accommodationModel.find({ 'location.city': city, isActive: true });
  }

  async getByType(type: string): Promise<any[]> {
    return this.accommodationModel.find({ type, isActive: true });
  }

  async addReview(accommodationId: string, reviewDto: any): Promise<any> {
    const review = new this.reviewModel({
      accommodationId,
      ...reviewDto,
    });

    const savedReview = await review.save();

    // Update accommodation rating
    const reviews = await this.reviewModel.find({ accommodationId });
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await this.accommodationModel.findByIdAndUpdate(accommodationId, {
      'rating.average': averageRating,
      'rating.count': reviews.length,
    });

    return savedReview;
  }

  async getReviews(accommodationId: string): Promise<any[]> {
    return this.reviewModel.find({ accommodationId }).sort({ createdAt: -1 });
  }
}
