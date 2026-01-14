import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turf } from '../entities/turf.entity';
import { CreateTurfDto } from './dto/create-turf.dto';
import { UpdateTurfDto } from './dto/update-turf.dto';
import { User, UserRole } from '../entities/user.entity';

@Injectable()
export class TurfsService {
  constructor(
    @InjectRepository(Turf)
    private turfRepository: Repository<Turf>,
  ) {}

  async create(createTurfDto: CreateTurfDto, owner: User) {
    if (owner.role !== UserRole.TURF_OWNER) {
      throw new UnauthorizedException('Only turf owners can create turfs');
    }

    const turf = this.turfRepository.create({
      ...createTurfDto,
      owner,
      ownerId: owner.id,
    });

    return this.turfRepository.save(turf);
  }

  async findAll(filters?: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
  }) {
    const query = this.turfRepository
      .createQueryBuilder('turf')
      .where('turf.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('turf.owner', 'owner');

    if (filters?.search) {
      query.andWhere(
        '(turf.name LIKE :search OR turf.description LIKE :search OR turf.address LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters?.minPrice) {
      query.andWhere('turf.pricePerHour >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters?.maxPrice) {
      query.andWhere('turf.pricePerHour <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    if (filters?.amenities && filters.amenities.length > 0) {
      // SQLite doesn't support array operations well, so we'll filter in memory
      // For production, use PostgreSQL with proper array support
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const turf = await this.turfRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!turf) {
      throw new NotFoundException('Turf not found');
    }

    return turf;
  }

  async findByOwner(ownerId: string) {
    return this.turfRepository.find({
      where: { ownerId },
      relations: ['bookings'],
    });
  }

  async update(id: string, updateTurfDto: UpdateTurfDto, owner: User) {
    const turf = await this.findOne(id);

    if (turf.ownerId !== owner.id && owner.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('You can only update your own turfs');
    }

    Object.assign(turf, updateTurfDto);
    return this.turfRepository.save(turf);
  }

  async remove(id: string, owner: User) {
    const turf = await this.findOne(id);

    if (turf.ownerId !== owner.id && owner.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('You can only delete your own turfs');
    }

    await this.turfRepository.remove(turf);
    return { message: 'Turf deleted successfully' };
  }

  async checkAvailability(turfId: string, date: string, startTime: string, endTime: string) {
    const turf = await this.findOne(turfId);
    
    // Check if the slot is in available slots
    const slotString = `${startTime}-${endTime}`;
    if (!turf.availableSlots.includes(slotString)) {
      return { available: false, reason: 'Slot not available' };
    }

    // In a real app, you'd check against existing bookings
    // For now, we'll just check if the slot exists
    return { available: true };
  }
}

