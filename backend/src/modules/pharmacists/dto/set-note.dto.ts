import { IsNotEmpty, ValidateNested } from 'class-validator';
import { SuggestionDto } from './suggestion.dto';

export class SetNoteDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @ValidateNested()
  suggestions: SuggestionDto[];
}
