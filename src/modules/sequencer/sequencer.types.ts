export interface ISequencerCtx {
  step: number;
}
export type SequencerType = (this: ISequencerCtx, ...args: number[]) => number | void | { [key: string]: any};
export type PipeType = (...args: number[]) => number | void | { [key: string]: any};

export type PipedSequencerType = () => SequencerType;

export interface IIsEven { status: boolean; number: number; }

export interface IPipedSequencerResult {
  invoke: () => SequencerType;
  pipeline: (seq: PipedSequencerType) => IPipedSequencerResult;
}

export interface IIterator {
  next: () => number;
}

export interface IRegistry {
  [key: string]: IIterator;
}
