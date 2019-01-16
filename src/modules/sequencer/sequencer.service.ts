import { Injectable, BadRequestException } from '@nestjs/common';
import { END_ERROR, FACTORIAL_SEQ, FIBONACCI_SEQ, RANGE_SEQ, PRIME_SEQ, PARTIAL_SUM_SEQ } from './sequencer.constants';
import { SequencerType, PipedSequencerType, IIterator, IPipedSequencerResult, IIsEven, ISequencerCtx } from './sequencer.types';
import { RunSequencerDto } from './dto/sequencer.dto';

@Injectable()
export class SequencerService {
  private readonly sequencerStrategy = {
    [FACTORIAL_SEQ]: this.factorialSeq,
    [FIBONACCI_SEQ]: this.fibonacciSeq,
    [RANGE_SEQ]: this.rangeSeq,
    [PRIME_SEQ]: this.primeSeq,
    [PARTIAL_SUM_SEQ]: this.partialSumSeq,
  };

  public factorialSeq(this: ISequencerCtx): number {
    return Array
      .from(Array(this.step).keys())
      .reduce((acc, _, ind) => acc * (ind + 1), 1);
  }

  public fibonacciSeq(this: ISequencerCtx): number {
    const step = this.step + 1;
    if (step === 1 || step === 2) {
      return 1;
    }
    let beforePrevious = 1;
    let previous = 1;
    let current = null;
    for (let i = 3; i <= step; i++) {
      current = beforePrevious + previous;
      beforePrevious = previous;
      previous = current;
    }
    return current;
  }

  public rangeSeq(this: ISequencerCtx, start: number, rangeStep: number): number {
    if (this.step === 0) {
      return start;
    }
    return start + (rangeStep * this.step);
  }

  public primeSeq(this: ISequencerCtx): number {
    const primeNumbers = [2];
    const { step } = this;
    let i = 2;
    while (!primeNumbers[step]) {
      if (!primeNumbers.some((primeNumber) => (i % primeNumber) === 0)) {
        primeNumbers.push(i);
      } else {
        i++;
      }
    }
    return primeNumbers[step];
  }

  public partialSumSeq(this: ISequencerCtx, ...args: number[]): number {
    const exist = args[this.step];
    if (exist === undefined) {
      return;
    }
    const partials = [];
    args.forEach((el, i) => {
      if (i === 0) {
        partials.push(el);
      } else {
        partials.push(el + partials[i - 1]);
      }
    });
    return partials[this.step];
  }

  public generator(sequencer: SequencerType, ...args: number[]): IIterator {
    let step = 0;
    return {
      next() {
        const value = sequencer.apply({ step }, args);
        ++ step;
        if (value === undefined) {
          throw new BadRequestException(END_ERROR);
        }
        return value;
      },
    };
  }

  public pipeSeq(sequencer: SequencerType, ...args: number[]): IPipedSequencerResult {
    const sequencers: SequencerType[] = [];
    return {
      pipeline(pipedSequencer: PipedSequencerType) {
        sequencers.push(pipedSequencer());
        return this;
      },
      invoke: () => function(this: ISequencerCtx) {
        return sequencers.reduce((piped, current) => current(piped), sequencer.apply(this, args));
      },
    };
  }

  public accumulator(): (value: number) => number {
    let sum = 0;
    return (value: number) => {
      sum += value;
      return sum;
    };
  }

  public isEven(): (value: number) => IIsEven {
    return (value: number) => ({
      status: value % 2 === 0,
      number: value,
    });
  }

  public getNextSequencerValue(dto: RunSequencerDto): number | IIsEven {
    let iterator: IIterator = null;
    const { accumulator, isEven, sequencerParams = [], sequencer } = dto;
    if (accumulator || isEven) {
      let pipedSeq = this.pipeSeq(this.sequencerStrategy[sequencer], ...sequencerParams);
      if (accumulator) {
        pipedSeq = pipedSeq.pipeline(this.accumulator);
      }
      if (isEven) {
        pipedSeq = pipedSeq.pipeline(this.isEven);
      }
      iterator = this.generator(pipedSeq.invoke());
    } else {
      iterator = this.generator(this.sequencerStrategy[sequencer], ...sequencerParams);
    }
    let i = 0;
    let result = null;
    while (i <= dto.step) {
      result = iterator.next();
      i++;
    }
    return result;
  }
}
