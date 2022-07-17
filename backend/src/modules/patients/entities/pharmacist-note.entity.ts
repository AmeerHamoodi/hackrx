import { Referal } from 'src/modules/patients/entities/referal.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Suggestion } from './suggestion.entity';

@Entity({ name: 'pharmacistNote' })
export class PharmacistNote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('longtext')
  content: string;

  @ManyToOne(() => Referal, (referal) => referal.pharmacistNotes)
  referal: Referal;

  @OneToMany(() => Suggestion, (suggestion) => suggestion.pharmacistNote)
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
