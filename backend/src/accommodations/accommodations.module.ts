import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccommodationsService } from './accommodations.service';
import { AccommodationsController } from './accommodations.controller';
import { AccommodationSchema } from './schemas/accommodation.schema';
import { ReviewSchema } from './schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Accommodation', schema: AccommodationSchema },
      { name: 'Review', schema: ReviewSchema },
    ]),
  ],
  providers: [AccommodationsService],
  controllers: [AccommodationsController],
  exports: [AccommodationsService],
})
export class AccommodationsModule {}
