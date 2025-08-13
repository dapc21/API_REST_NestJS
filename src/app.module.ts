import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreedsModule } from './breeds/breeds.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'db_crud',
      autoLoadEntities: true,
      synchronize: true, // Solo en desarrollo
      // logging: true, // Para ver las consultas SQL que se ejecutan
    }),
    CatsModule,
    BreedsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
