import validator from 'class-validator';

export class CreateTaskDto {
  @validator.IsNotEmpty()
  title: string;

  @validator.IsNotEmpty()
  description: string;
}
