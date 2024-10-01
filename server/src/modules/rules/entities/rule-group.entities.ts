import { Collection } from '../../collections/entities/collection.entities';
import { ICollection } from '../../collections/interfaces/collection.interface';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Rules } from './rules.entities';
import { Notification } from '../../notifications/entities/notification.entities';

@Entity()
export class RuleGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  libraryId: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  collectionId: number;

  @Column({ nullable: false, default: true })
  useRules: boolean;

  @Column({ nullable: true })
  dataType: number;

  @OneToMany((type) => Rules, (rules) => rules.ruleGroup, {
    onDelete: 'CASCADE',
  })
  rules: Rules[];

  @ManyToMany(() => Notification)
  @JoinTable()
  notifications: Notification[]

  @OneToOne(() => Collection, (c) => c.ruleGroup, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  collection: ICollection;
}
