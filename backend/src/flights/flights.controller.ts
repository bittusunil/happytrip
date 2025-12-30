import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FlightsService } from './flights.service';
import { SearchFlightsDto } from './dto/search-flights.dto';

@ApiTags('Flights')
@Controller('flights')
export class FlightsController {
  constructor(private flightsService: FlightsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for flights' })
  async search(@Query() searchDto: SearchFlightsDto) {
    return this.flightsService.search(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get flight by ID' })
  async getById(@Param('id') id: string) {
    return this.flightsService.findById(id);
  }

  @Get('airline/:airline')
  @ApiOperation({ summary: 'Get flights by airline' })
  async getByAirline(@Param('airline') airline: string) {
    return this.flightsService.getFlightsByAirline(airline);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new flight (Admin)' })
  async create(@Body() createFlightDto: any) {
    return this.flightsService.create(createFlightDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update flight (Admin)' })
  async update(@Param('id') id: string, @Body() updateFlightDto: any) {
    return this.flightsService.update(id, updateFlightDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete flight (Admin)' })
  async delete(@Param('id') id: string) {
    await this.flightsService.delete(id);
  }
}
