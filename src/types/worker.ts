import { createQueue } from '@banez/queue';
import type { WorkerTask } from '.';

export class Worker {
  public busy = false;
  public queue = createQueue();

  constructor(
    public name: string,
    public getTask: () => WorkerTask | undefined,
    public onFree: () => void,
  ) {}

  run(task: WorkerTask | undefined): void {
    if (task) {
      this.busy = true;
      this.queue({
        name: this.name,
        handler: async () => {
          try {
            const result = await task.fn();
            task.onDone(result, this.name);
          } catch (error) {
            task.onError(error, this.name);
          }
          this.busy = false;
          this.onFree();
        },
      });
    }
  }
}
