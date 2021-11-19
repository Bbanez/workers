import {
  Worker,
  WorkerError,
  WorkerFunction,
  WorkerManager,
  WorkerResult,
  WorkerTask,
} from './types';

export function createWorkerManager({ count }: { count: number }): WorkerManager {
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
        }
      },
    );
    workers.push(worker);
  }

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
