import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus, BookingType } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PaginatedResponse } from '../common/dto/response.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async create(userId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
    const booking = this.bookingsRepository.create({
      userId,
      ...createBookingDto,
      status: BookingStatus.PENDING,
    });

    return this.bookingsRepository.save(booking);
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async findByUser(userId: string, page = 1, limit = 10): Promise<PaginatedResponse<Booking>> {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.bookingsRepository.find({
        where: { userId },
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      }),
      this.bookingsRepository.count({ where: { userId } }),
    ]);

    return new PaginatedResponse(bookings, total, page, limit);
  }

  async findByReferenceId(referenceId: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { referenceId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findById(id);

    Object.assign(booking, updateBookingDto);
    return this.bookingsRepository.save(booking);
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const booking = await this.findById(id);

    // Validate status transitions
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
      [BookingStatus.CONFIRMED]: [BookingStatus.CANCELLED, BookingStatus.COMPLETED],
      [BookingStatus.CANCELLED]: [],
      [BookingStatus.COMPLETED]: [],
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      throw new BadRequestException(
        `Cannot transition from ${booking.status} to ${status}`,
      );
    }

    booking.status = status;
    return this.bookingsRepository.save(booking);
  }

  async cancel(id: string): Promise<Booking> {
    const booking = await this.findById(id);

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    booking.status = BookingStatus.CANCELLED;
    return this.bookingsRepository.save(booking);
  }

  async getBookingsByType(type: BookingType, page = 1, limit = 10): Promise<PaginatedResponse<Booking>> {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.bookingsRepository.find({
        where: { type },
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      }),
      this.bookingsRepository.count({ where: { type } }),
    ]);

    return new PaginatedResponse(bookings, total, page, limit);
  }

  async getBookingsByStatus(
    status: BookingStatus,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<Booking>> {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.bookingsRepository.find({
        where: { status },
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      }),
      this.bookingsRepository.count({ where: { status } }),
    ]);

    return new PaginatedResponse(bookings, total, page, limit);
  }
}
