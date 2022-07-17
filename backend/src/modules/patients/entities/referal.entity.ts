import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import { PharmacistNote } from './pharmacist-note.entity';

@Entity({ name: 'referals' })
export class Referal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  patient: User;

  @ManyToOne(() => User)
  pharmacist: User;

  @ManyToOne(() => User, (user) => user.referedByMe)
  referringDoctor: User;

  @Column('longtext', { nullable: true })
  notes: string;

  @Column('longtext')
  diagnosis: string;

  @OneToMany(() => PharmacistNote, (pharmacistNote) => pharmacistNote.referal)
  pharmacistNotes: PharmacistNote[];

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
