import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { SequencerModule } from '../src/modules/sequencer/sequencer.module';
import { SequencerService } from '../src/modules/sequencer/sequencer.service';
import { RANGE_SEQ, PARTIAL_SUM_SEQ } from '../src/modules/sequencer/sequencer.constants';

describe('Sequencers', () => {
  let app: INestApplication;
  const sequencerServiceMock = { getNextSequencerValue: () => 1 };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [SequencerModule],
    })
    .overrideProvider(SequencerService)
    .useValue(sequencerServiceMock)
    .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`/POST sequencer success result`, () => {
    return request(app.getHttpServer())
      .post('/sequencer')
      .expect(HttpStatus.CREATED)
      .send({
        sequencer: RANGE_SEQ,
        sequencerParams: [1, 3],
        accumulator: false,
        isEven: false,
        step: 0,
      })
      .expect({ data: sequencerServiceMock.getNextSequencerValue() });
  });

  afterAll(async () => {
    await app.close();
  });
});
