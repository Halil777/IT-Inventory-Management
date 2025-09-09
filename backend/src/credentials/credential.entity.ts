import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Credential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  login: string;

  // WARNING: Storing plaintext passwords is insecure. Consider encryption.
  @Column()
  password: string;
}

