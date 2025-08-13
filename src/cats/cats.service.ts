import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';

@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,
    @InjectRepository(Breed)
    private breedsRepository: Repository<Breed>,
  ) { }

  async create(createCatDto: CreateCatDto) {
    // Validar si el breed_id existe (si se proporciona)
    if (createCatDto.breed_id) {
      const breed = await this.breedsRepository.findOne({
        where: { id: createCatDto.breed_id }
      });

      if (!breed) {
        throw new BadRequestException(`Breed with ID ${createCatDto.breed_id} not found`);
      }
    }

    return await this.catsRepository.save(createCatDto);
  }

  async findAll() {
    return await this.catsRepository.find({
      relations: ['breed'] // Incluir la relación con breed
    });
  }

  async findOne(id: number) {
    return await this.catsRepository.findOne({
      where: { id },
      relations: ['breed'] // Incluir la relación con breed
    });
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    // Verificar si el gato existe
    const existingCat = await this.catsRepository.findOne({
      where: { id }
    });

    if (!existingCat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }

    // Validar si el nuevo breed_id existe (si se proporciona)
    if (updateCatDto.breed_id) {
      const breed = await this.breedsRepository.findOne({
        where: { id: updateCatDto.breed_id }
      });

      if (!breed) {
        throw new BadRequestException(`Breed with ID ${updateCatDto.breed_id} not found`);
      }
    }
    return await this.catsRepository.update(id, updateCatDto);
  }

  async remove(id: number) {
    return await this.catsRepository.softDelete(id);
  }

  // MÉTODO ADICIONAL: Para recuperar elementos eliminados
  async findAllWithDeleted() {
    return await this.catsRepository.find({
      withDeleted: true,
      relations: ['breed']
    });
  }

  // MÉTODO ADICIONAL: Para restaurar un elemento eliminado
  async restore(id: number) {
    return await this.catsRepository.restore(id);
  }
}
