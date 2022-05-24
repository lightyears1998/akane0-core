import { Column } from "typeorm";

export class IdentityContact {
  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  qq?: string;
}
