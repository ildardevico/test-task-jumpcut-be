export type SequencerType = (...args: number[]) => number | void | { [key: string]: any};

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

export interface IClient {
  iterator: IIterator;
  sequencer: string;
  isEven: boolean;
  accumulator: boolean;
  sequencerParams: number[];
}

export interface IClients {
  [key: string]: IClient;
}
