import { Suggestion } from 'src/modules/patients/entities/suggestion.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'medications' })
export class Medication extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  dosage: string;

  @Column('longtext')
  instructions: string;

  @ManyToOne(() => User, (user) => user.medicationsPrescribedToMe)
  patient: User;

  @ManyToOne(() => User, (user) => user.medicationsPrescribedByMe)
  pharmacist: User;

  @OneToMany(() => Suggestion, (suggestion) => suggestion.medication)
  suggestions: Suggestion[];

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
