import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { SequencerService } from './sequencer.service';
import { RunSequencerDto } from './dto/sequencer.dto';
import { IIsEven } from './sequencer.types';
import { ApiResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('sequencers')
@Controller('/sequencer')
export class SequencerController {
  constructor(private readonly sequencerService: SequencerService) {}

  @ApiOperation({ title: 'Get next sequencer value'})
  @ApiResponse({ status: 201, description: 'Returns new value in the sequence' })
  @ApiResponse({ status: 400, description: 'BadRequest', type: BadRequestException })
  @Post()
  nextSequencerValue(@Body() dto: RunSequencerDto): { data: number | IIsEven } {
    const data = this.sequencerService.getNextSequencerValue(dto);
    return { data };
  }
}
