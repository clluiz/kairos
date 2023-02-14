import { Signals } from 'close-with-grace'

export interface CloseWithGraceCallbackOptions {
    err?: Error,
    signal?: Signals,
    manual?: boolean,
  }