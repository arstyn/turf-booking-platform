import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TurfsService } from './turfs.service';
import { CreateTurfDto } from './dto/create-turf.dto';
import { UpdateTurfDto } from './dto/update-turf.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities/user.entity';

@Controller('turfs')
export class TurfsController {
  constructor(private readonly turfsService: TurfsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TURF_OWNER)
  create(@Body() createTurfDto: CreateTurfDto, @Request() req) {
    return this.turfsService.create(createTurfDto, req.user);
  }

  @Get()
  findAll(@Query() query: any) {
    const filters = {
      search: query.search,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      amenities: query.amenities
        ? query.amenities.split(',').filter((a: string) => a)
        : undefined,
    };
    return this.turfsService.findAll(filters);
  }

  @Get('my-turfs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TURF_OWNER)
  findMyTurfs(@Request() req) {
    return this.turfsService.findByOwner(req.user.id);
  }

  @Get('availability/:id')
  checkAvailability(
    @Param('id') id: string,
    @Query('date') date: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return this.turfsService.checkAvailability(id, date, startTime, endTime);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turfsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateTurfDto: UpdateTurfDto,
    @Request() req,
  ) {
    return this.turfsService.update(id, updateTurfDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.turfsService.remove(id, req.user);
  }
}

