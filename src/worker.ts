import { createQueue } from '@banez/queue';
import type { WorkerTask } from './types';

export class Worker {
  public busy = false;
  public queue = createQueue();

  constructor(
    public id: string,
    public getTask: () => WorkerTask | undefined,
    public onFree: () => void,
  ) {}

  run(task: WorkerTask | undefined): void {
    if (task) {
      this.busy = true;
      this.queue({
        name: this.id,
        handler: async () => {
          try {
            const result = await task.fn(this.id);
            task.onDone(result, this.id);
          } catch (error) {
            task.onError(error, this.id);
          }
          this.busy = false;
          this.onFree();
        },
      });
    }
  }
}
