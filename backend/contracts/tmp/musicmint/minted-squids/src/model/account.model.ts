import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Owner} from "./owner.model"

@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Owner, {nullable: true})
  transfersFrom!: Owner | undefined | null

  @Index_()
  @ManyToOne_(() => Owner, {nullable: true})
  transfersTo!: Owner | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  timestamp!: Date

 
}
