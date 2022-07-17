import { Medication } from 'src/modules/medications/entities/medication.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PharmacistNote } from './pharmacist-note.entity';

@Entity({ name: 'suggestions' })
export class Suggestion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => PharmacistNote,
    (pharmacistNote) => pharmacistNote.suggestions,
  )
  pharmacistNote: PharmacistNote;

  @Column('longtext')
  message: string;

  @ManyToOne(() => Medication, (medication) => medication.suggestions)
  @JoinColumn()
  medication: Medication;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
