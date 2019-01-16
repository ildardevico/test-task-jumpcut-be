import { IsNotEmpty, IsString, IsArray, IsNumber, IsIn, IsBoolean, IsOptional, ValidateIf, ArrayMinSize } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { FACTORIAL_SEQ, FIBONACCI_SEQ, RANGE_SEQ, PRIME_SEQ, PARTIAL_SUM_SEQ } from '../sequencer.constants';

export class RunSequencerDto {
  @ApiModelProperty()
  @IsNotEmpty()
  @IsNumber()
  step: number;

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn([ FACTORIAL_SEQ, FIBONACCI_SEQ, RANGE_SEQ, PRIME_SEQ, PARTIAL_SUM_SEQ ])
  sequencer: string;

  @ApiModelPropertyOptional({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @ValidateIf((o) => o.sequencer === RANGE_SEQ)
  @ArrayMinSize(2)
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
