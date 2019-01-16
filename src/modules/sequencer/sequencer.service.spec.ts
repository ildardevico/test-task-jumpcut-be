import { SequencerService } from './sequencer.service';
import { IPipedSequencerResult } from './sequencer.types';
import { RANGE_SEQ } from './sequencer.constants';

describe('SequencerService', () => {
  const sequencerService = new SequencerService();

  describe('factorialSeq', () => {
    it('Should return 1 for steps 0 and 1', () => {
      expect(sequencerService.factorialSeq.call({ step: 0 })).toEqual(1);
      expect(sequencerService.factorialSeq.call({ step: 1 })).toEqual(1);
    });
    it('Should return 6 for step 3', () => {
      expect(sequencerService.factorialSeq.call({ step: 3 })).toEqual(6);
    });
    it('Should return 3628800 for step 10', () => {
      expect(sequencerService.factorialSeq.call({ step: 10 })).toEqual(3628800);
    });
  });

  describe('fibonacciSeq', () => {
    it('Should return 1 for steps 0 and 1', () => {
      expect(sequencerService.fibonacciSeq.call({ step: 0 })).toEqual(1);
      expect(sequencerService.fibonacciSeq.call({ step: 1 })).toEqual(1);
    });
    it('Should return 5 for step 4', () => {
      expect(sequencerService.fibonacciSeq.call({ step: 4 })).toEqual(5);
    });
    it('Should return 55 for step 9', () => {
      expect(sequencerService.fibonacciSeq.call({ step: 9 })).toEqual(55);
    });
  });

  describe('rangeSeq', () => {
    it('Should return start value for step 0', () => {
      const start = 1;
      const step = 2;
      expect(sequencerService.rangeSeq.call({ step: 0 }, start, step)).toEqual(start);
    });
    it('Should return 3 for step 1', () => {
      const start = 1;
      const step = 2;
      expect(sequencerService.rangeSeq.call({ step: 1 }, start, step)).toEqual(start + step);
    });
    it('Should return 11 for step 5', () => {
      const start = 1;
      const step = 2;
      expect(sequencerService.rangeSeq.call({ step: 5 }, start, step)).toEqual(11);
    });
  });

  describe('primeSeq', () => {
    it('Should return 2 for step 0', () => {
      expect(sequencerService.primeSeq.call({ step: 0 })).toEqual(2);
    });
    it('Should return 7 for step 3', () => {
      expect(sequencerService.primeSeq.call({ step: 3 })).toEqual(7);
    });
    it('Should return 13 for step 5', () => {
      expect(sequencerService.primeSeq.call({ step: 5 })).toEqual(13);
    });
  });

  describe('partialSumSeq', () => {
    it('Should return 1 for step 0', () => {
      const args = [1, 3, 7, 2, 0];
      expect(sequencerService.partialSumSeq.apply({ step: 0 }, args)).toEqual(1);
    });
    it('Should return 4 for step 1', () => {
      const args = [1, 3, 7, 2, 0];
      expect(sequencerService.partialSumSeq.apply({ step: 1 }, args)).toEqual(4);
    });
    it('Should return 13 for step 4', () => {
      const args = [1, 3, 7, 2, 0];
      expect(sequencerService.partialSumSeq.apply({ step: 4 }, args)).toEqual(13);
    });
    it('Should return undefined for step 5', () => {
      const args = [1, 3, 7, 2, 0];
      expect(sequencerService.partialSumSeq.apply({ step: 5 }, args)).toBeUndefined();
    });
  });

  describe('generator', () => {
    it('Should return object with next method', () => {
      const testSequencer = () => 1;
      expect(sequencerService.generator(testSequencer).next.call).toBeTruthy();
    });
    it('Should call testSequencer with step 0', () => {
      function testSequencer() {
        expect(this.step).toEqual(0);
        return 1;
      }
      const spy = jest.fn(testSequencer);
      sequencerService.generator(spy).next();
      expect(spy).toBeCalled();
    });
    it('Should call testSequencer with args and return the result of sequencer', () => {
      const testArgs = [1, 2];
      function testSequencer(...args: number[]) {
        expect(args).toEqual(testArgs);
        return 1;
      }
      const spy = jest.fn(testSequencer);
      const value = sequencerService.generator(spy, ...testArgs).next();
      expect(spy).toBeCalled();
      expect(value).toEqual(1);
    });
    it('Should increment step', () => {
      function testSequencer() {
        return this.step;
      }
      const iterator = sequencerService.generator(testSequencer);
      expect(iterator.next()).toEqual(0);
      expect(iterator.next()).toEqual(1);
      expect(iterator.next()).toEqual(2);
    });
    it('Should throw Error(Done)', () => {
      function testSequencer() {
        return;
      }
      const iterator = sequencerService.generator(testSequencer);
      expect(() => iterator.next()).toThrowError();
    });
  });

  describe('pipeSeq', () => {
    it('Should return pipeline and invoke methods, pipeline should allow to make chaining', () => {
      function testSequencer() {
        return this.step;
      }
      const testPipelineSequencer = () => (n: number) => n;
      const testMethodsExist = (seq: IPipedSequencerResult) => {
        expect(seq.invoke.call).toBeTruthy();
        expect(seq.pipeline.call).toBeTruthy();
      };

      const pipedSeq = sequencerService.pipeSeq(testSequencer);
      testMethodsExist(pipedSeq);
      const usedPipeline = pipedSeq.pipeline(testPipelineSequencer);
      testMethodsExist(usedPipeline);
      const chainedPipeLine = usedPipeline.pipeline(testPipelineSequencer);
      testMethodsExist(chainedPipeLine);
    });

    it('Should call sequencer and pipeline sequencers and pass through returning value', () => {
      function testSequencer() {
        return this.step;
      }
      const testSequencerSpy = jest.fn(testSequencer);
      const testPipelineSequencer = () => (n: number) => n + 2;
      const testPipelineSequencerSpy = jest.fn(testPipelineSequencer);

      const pipedSeq = sequencerService.pipeSeq(testSequencerSpy)
        .pipeline(testPipelineSequencerSpy)
        .pipeline(testPipelineSequencerSpy)
        .invoke();

      expect(testPipelineSequencerSpy).toBeCalled();
      expect(pipedSeq.call({ step: 1 })).toEqual(5);
      expect(testSequencerSpy).toBeCalled();
    });
  });

  describe('getNextSequencerValue', () => {
    it('Should start range sequencer and pass params from body to sequencer', () => {
      const startSeq = (step: number) => sequencerService.getNextSequencerValue({
        sequencer: RANGE_SEQ,
        sequencerParams: [1, 3],
        step,
        isEven: false,
        accumulator: false,
      });
      expect(startSeq(0)).toEqual(1);
      expect(startSeq(1)).toEqual(4);
    });
    it('Should start pipe with range sequencer and pass params from body to sequencer', () => {
      const startSeq = (step: number) => sequencerService.getNextSequencerValue({
        sequencer: RANGE_SEQ,
        sequencerParams: [1, 3],
        isEven: true,
        accumulator: true,
        step,
      });
      expect(startSeq(0)).toEqual({ number: 1, status: false });
      expect(startSeq(1)).toEqual({ number: 5, status: false });
      expect(startSeq(2)).toEqual({ number: 12, status: true });
    });
  });

  describe('accumulator', () => {
    it('Should return function which accumulate sum between calls', () => {
      const accumulator = sequencerService.accumulator();
      expect(accumulator.call).toBeTruthy();
      expect(accumulator(2)).toEqual(2);
      expect(accumulator(3)).toEqual(5);
      expect(accumulator(3)).toEqual(8);
    });
  });

  describe('isEven', () => {
    it('Should return function which check if number is even', () => {
      const isEven = sequencerService.isEven();
      expect(isEven.call).toBeTruthy();
      expect(isEven(1)).toEqual({ status: false, number: 1 });
      expect(isEven(2)).toEqual({ status: true, number: 2 });
    });
  });
});
