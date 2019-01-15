import { Module } from '@nestjs/common';
import { SequencerController } from './sequencer.controller';
import { SequencerService } from './sequencer.service';

@Module({
  controllers: [SequencerController],
  providers: [SequencerService],
})
export class SequencerModule {}
