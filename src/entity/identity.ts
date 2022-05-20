import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Identity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;
}
