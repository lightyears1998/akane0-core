import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { appDataSource, debugPrint } from "../app";

import { IdentityContact } from "./indentity-contact";

@Entity()
export class Identity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ default: false })
  isMaster!: boolean;

  @Column({ default: false })
  isAdmin!: boolean;

  @Column(() => IdentityContact)
  contact!: IdentityContact;
}

export async function initMasterIdentity() {
  await appDataSource.manager.transaction(async (manager) => {
    let master = await manager.findOne(Identity, {
      where: { isMaster: true },
    });
    if (!master) {
      master = manager.create(Identity, { isMaster: true });
      master = await manager.save(master);
      debugPrint(`Master identity created`, master);
    }
  });
}
