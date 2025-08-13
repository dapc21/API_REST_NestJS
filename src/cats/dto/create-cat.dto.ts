import { IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateCatDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsInt()
    @IsPositive()
    age: number;

    @IsNumber()
    @IsOptional()
    breed_id?: number;

}
