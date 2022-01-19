import type { WorkerError } from './error';
import type { WorkerResult } from './result';

export interface WorkerFunction<Output> {
  (workerId: string): Promise<Output>;
}

export interface WorkerManager {
  assign<Output>(
    fn: WorkerFunction<Output>,
  ): Promise<WorkerResult<Output> | WorkerError>;
  isWorking(): boolean;
  wait(): Promise<void>
}

export interface WorkerTask {
  fn: WorkerFunction<unknown>;
  onDone(result: unknown, workerName: string): void;
  onError(error: unknown, workerName: string): void;
}
