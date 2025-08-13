import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Breed } from './entities/breed.entity';

@Injectable()
export class BreedsService {

  constructor(
    @InjectRepository(Breed)
    private breedsRepository: Repository<Breed>,
  ) { }

  async create(createBreedDto: CreateBreedDto) {
    // Verificar si ya existe una raza con el mismo nombre
    const existingBreed = await this.breedsRepository.findOne({
      where: { name: createBreedDto.name }
    });

    if (existingBreed) {
      throw new BadRequestException(`Breed with name '${createBreedDto.name}' already exists`);
    }

    const breed = this.breedsRepository.create(createBreedDto);
    return await this.breedsRepository.save(breed);
  }

  async findAll() {
    return await this.breedsRepository.find({
      relations: ['cats'] // Incluir los gatos relacionados si lo necesitas
    });
  }

  async findOne(id: number) {
    const breed = await this.breedsRepository.findOne({
      where: { id },
      relations: ['cats']
    });

    if (!breed) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }

    return breed;
  }

  async update(id: number, updateBreedDto: UpdateBreedDto) {
    // Verificar si la raza existe
    await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no exista otra raza con ese nombre
    if (updateBreedDto.name) {
      const existingBreed = await this.breedsRepository.findOne({
        where: { name: updateBreedDto.name }
      });

      if (existingBreed && existingBreed.id !== id) {
        throw new BadRequestException(`Breed with name '${updateBreedDto.name}' already exists`);
      }
    }

    const result = await this.breedsRepository.update(id, updateBreedDto);

    if (result.affected === 0) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }

    return this.findOne(id); // Retornar la raza actualizada con relaciones
  }

  async remove(id: number) {
    // Verificar si la raza existe
    const breed = await this.findOne(id);

    // Verificar si hay gatos asociados a esta raza
    if (breed.cats && breed.cats.length > 0) {
      throw new BadRequestException(
        `Cannot delete breed '${breed.name}' because it has ${breed.cats.length} cat(s) associated. Please reassign or delete the cats first.`
      );
    }

    const result = await this.breedsRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }

    return { message: `Breed '${breed.name}' has been deleted` };
  }

  async restore(id: number) {
    const result = await this.breedsRepository.restore(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }

    return this.findOne(id);
  }

  async findAllWithDeleted() {
    return await this.breedsRepository.find({
      withDeleted: true,
      relations: ['cats']
    });
  }

  // Buscar razas por nombre (parcial)
  async searchByName(name: string) {
    return await this.breedsRepository
      .createQueryBuilder('breed')
      .where('breed.name LIKE :name', { name: `%${name}%` })
      .leftJoinAndSelect('breed.cats', 'cats')
      .getMany();
  }

}
