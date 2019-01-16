import { Controller, Post, Body, BadRequestException, HttpStatus } from '@nestjs/common';
import { SequencerService } from './sequencer.service';
import { RunSequencerDto } from './dto/sequencer.dto';
import { IIsEven } from './sequencer.types';
import { ApiResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('sequencers')
@Controller('/sequencer')
export class SequencerController {
  constructor(private readonly sequencerService: SequencerService) {}

  @ApiOperation({ title: 'Create next sequencer value'})
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns new value in the sequence' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'BadRequest', type: BadRequestException })
  @Post()
  nextSequencerValue(@Body() dto: RunSequencerDto): { data: number | IIsEven } {
    const data = this.sequencerService.getNextSequencerValue(dto);
    return { data };
  }
}
