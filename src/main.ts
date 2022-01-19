import { Worker } from './worker';
import {
  WorkerError,
  WorkerFunction,
  WorkerManager,
  WorkerResult,
  WorkerTask,
} from './types';

export function createWorkerManager({
  count,
}: {
  count: number;
}): WorkerManager {
  const workers: Worker[] = [];
  const tasks: WorkerTask[] = [];
  for (let i = 0; i < count; i++) {
    const worker = new Worker(
      '' + i,
      () => {
        return tasks.pop();
      },
      () => {
        if (tasks.length > 0) {
          worker.run(tasks.pop());
        } else {
          for (let j = 0; j < awaiters.length; j++) {
            const awaiter = awaiters[j];
            awaiter();
          }
        }
      },
    );
    workers.push(worker);
  }
  const awaiters: Array<() => void> = [];

  function runWorkers() {
    if (tasks.length > 0) {
      for (let i = 0; i < workers.length; i++) {
        const worker = workers[i];
        if (!worker.busy) {
          worker.run(tasks.pop());
        }
      }
    }
  }

  return {
    isWorking() {
      return tasks.length > 0;
    },
    async wait() {
      if (tasks.length > 0) {
        await new Promise<void>((resolve) => {
          awaiters.push(resolve);
        });
      }
    },
    async assign<Output>(fn: WorkerFunction<Output>) {
      return new Promise<WorkerResult<Output> | WorkerError>((resolve) => {
        tasks.push({
          fn,
          onDone(value, workerName) {
            resolve(new WorkerResult(value as Output, workerName));
          },
          onError(error, workerName) {
            resolve(new WorkerError(error, workerName));
          },
        });
        runWorkers();
      });
    },
  };
}
