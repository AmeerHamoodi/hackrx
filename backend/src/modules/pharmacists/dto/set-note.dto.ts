import { IsNotEmpty } from 'class-validator';

export class SetNoteDto {
  @IsNotEmpty()
  content: string;
}
