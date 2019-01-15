import { Module } from '@nestjs/common';
import { SequencerModule } from './modules/sequencer/sequencer.module';

@Module({
  imports: [SequencerModule],
})
export class AppModule {}
