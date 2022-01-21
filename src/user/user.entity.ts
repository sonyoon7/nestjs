import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: "PA1010"})
// ({name: "users"})

export class User {

  @PrimaryGeneratedColumn()
  C_CD: string;

  @PrimaryGeneratedColumn()
  EMP_ID: string;

  @Column()
  EMP_NM: string;

  @Column()
  PER_NO: string;

  // @PrimaryGeneratedColumn()
  // id: bigint;
  //
  // @Column()
  // firstName: string;
  // first_name: type.STRING,
  // last_name: type.STRING,
  // email: {
  //   type: type.STRING,
  //   allowNull: false,
  // },
  // username: {
  //   type: type.STRING,
  //   allowNull: false,
  // },
  // password: {
  //   type: type.STRING,
  //   allowNull: false,
  // },
  // resetPasswordToken: type.STRING,
  // resetPasswordExpires: type.DATE,

}