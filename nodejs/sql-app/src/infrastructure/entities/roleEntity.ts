import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IRoleEntity } from "../../domain/entities/IRoleEntity";

@Entity()
export class RoleEntity implements IRoleEntity{
    name: string;
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    rolName: string;

    @Column({ type: 'text' })
    description: string;
}