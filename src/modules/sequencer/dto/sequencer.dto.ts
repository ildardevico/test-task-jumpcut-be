import { IsNotEmpty, IsString, IsArray, IsNumber, IsIn, IsBoolean, IsOptional } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { FACTORIAL_SEQ, FIBONACCI_SEQ, RANGE_SEQ, PRIME_SEQ, PARTIAL_SUM_SEQ } from '../sequencer.constants';

export class RunSequencerDto {
  @ApiModelProperty({ description: 'uniq value for every client' })
  @IsNotEmpty()
  @IsString()
  client: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn([ FACTORIAL_SEQ, FIBONACCI_SEQ, RANGE_SEQ, PRIME_SEQ, PARTIAL_SUM_SEQ])
  sequencer: string;

  @ApiModelPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  sequencerParams: number[];

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsBoolean()
  accumulator: boolean;

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isEven: boolean;
}
