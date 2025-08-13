import { Breed } from "src/breeds/entities/breed.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cat {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    age: number;

    // Agregamos la relación con Breed
    @ManyToOne('Breed', 'cats')

    @JoinColumn({ name: 'breed_id' }) // Nombre de la columna FK en la tabla
    breed: Breed;

    @Column({ nullable: true })
    breed_id: number; // Columna para almacenar el ID de la raza

    @DeleteDateColumn()
    deleteAt: Date;

}
