import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccommodationsService } from './accommodations.service';
import { SearchAccommodationsDto } from './dto/search-accommodations.dto';

@ApiTags('Accommodations')
@Controller('accommodations')
export class AccommodationsController {
  constructor(private accommodationsService: AccommodationsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for accommodations' })
  async search(@Query() searchDto: SearchAccommodationsDto) {
    return this.accommodationsService.search(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get accommodation by ID' })
  async getById(@Param('id') id: string) {
    return this.accommodationsService.findById(id);
  }

  @Get('city/:city')
  @ApiOperation({ summary: 'Get accommodations by city' })
  async getByCity(@Param('city') city: string) {
    return this.accommodationsService.getByCity(city);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get accommodations by type' })
  async getByType(@Param('type') type: string) {
    return this.accommodationsService.getByType(type);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new accommodation' })
  async create(@Body() createAccommodationDto: any) {
    return this.accommodationsService.create(createAccommodationDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update accommodation' })
  async update(@Param('id') id: string, @Body() updateAccommodationDto: any) {
    return this.accommodationsService.update(id, updateAccommodationDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete accommodation' })
  async delete(@Param('id') id: string) {
    await this.accommodationsService.delete(id);
  }

  @Post(':id/reviews')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add review to accommodation' })
  async addReview(@Param('id') id: string, @Body() reviewDto: any) {
    return this.accommodationsService.addReview(id, reviewDto);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get reviews for accommodation' })
  async getReviews(@Param('id') id: string) {
    return this.accommodationsService.getReviews(id);
  }
}
