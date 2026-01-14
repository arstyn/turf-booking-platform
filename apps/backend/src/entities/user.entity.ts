import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Turf } from './turf.entity';
import { Booking } from './booking.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  TURF_OWNER = 'turf_owner',
}

export enum OnboardingStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'simple-enum',
    enum: OnboardingStatus,
    default: OnboardingStatus.PENDING,
  })
  onboardingStatus: OnboardingStatus;

  // Turf Owner specific fields
  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  businessAddress: string;

  @Column({ nullable: true })
  businessPhone: string;

  @Column({ nullable: true, type: 'text' })
  businessDescription: string;

  @Column({ nullable: true })
  taxId: string;

  // User specific fields
  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Turf, (turf) => turf.owner)
  turfs: Turf[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

