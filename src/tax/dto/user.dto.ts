import { IsArray, IsNotEmpty, IsString } from 'class-validator';


export class UserDto {

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  readonly empIds: string[];

}

export class FileDto {

  readonly FILENAME: string;

}

export class FileValidationDto {

  readonly result: boolean;
  readonly hasInvalidFileArr: string[];

}




