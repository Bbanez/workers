# Workers

Workers in the context of this package are handler with will run asynchronous functions. In general, if there as N tasks and M workers, worker manager will assign 1 task to each available worker. When worker completes a task it will report back to manager. If there are uncompleted tasks in the pool, manager will assign a new task to the worker.

When assigning task to the manager, it will be added to the task pool. When a worker is free (not doing anything), manager will assign the task to it.

Idea is to use workers in conjunction with child process to utilize parallel processing, but worker task can be any asynchronous function.