import { Medication } from 'src/modules/medications/entities/medication.entity';
import { Referal } from 'src/modules/patients/entities/referal.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';

export enum Role {
  Pharmacist = 'pharmacist',
  Doctor = 'doctor',
  Patient = 'patient',
}
@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column('longtext')
  password: string;

  @Column({ type: 'enum', enum: Role, default: 'patient' })
  role: Role;

  @OneToMany(() => Medication, (medication) => medication.patient)
  medicationsPrescribedToMe: Medication[];

  @OneToMany(() => Medication, (medication) => medication.pharmacist)
  medicationsPrescribedByMe: Medication[];

  @OneToMany(() => Referal, (referal) => referal.referringDoctor)
  referedByMe: Referal[];

  @OneToMany(() => Referal, (referal) => referal.pharmacist)
  referals: Referal;

  @Column('text', { nullable: true })
  doxyLink?: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
