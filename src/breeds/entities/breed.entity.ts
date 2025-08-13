import { Cat } from "src/cats/entities/cat.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Breed {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 500
    })
    name: string;

    // Relación uno a muchos: Una raza puede tener muchos gatos
    @OneToMany('Cat', 'breed')
    cats: Cat[];

    @DeleteDateColumn()
    deletedAt: Date;
}
