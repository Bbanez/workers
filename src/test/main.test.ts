import { expect } from 'chai';
import { createWorkerManager } from '..';

describe('Workers', async () => {
  it('should start 3 tasks with 2 workers', async () => {
    const manager = createWorkerManager({ count: 2 });
    const results: string[] = [];
    const ws = [
      manager
        .assign<string>(async () => {
          return await new Promise((resolve) => {
            setTimeout(() => {
              resolve('w1 done');
            }, 500);
          });
        })
        .then((result) => {
          results.push(result.workerId);
        }),
      manager
        .assign<string>(async () => {
          return await new Promise((resolve) => {
            setTimeout(() => {
              resolve('w2 done');
            }, 200);
          });
        })
        .then((result) => {
          results.push(result.workerId);
        }),
      manager
        .assign<string>(async () => {
          return await new Promise((resolve) => {
            setTimeout(() => {
              resolve('w3 done');
            }, 200);
          });
        })
        .then((result) => {
          results.push(result.workerId);
        }),
    ];
    for (let i = 0; i < ws.length; i++) {
      const w = ws[i];
      await w;
    }
    expect(results[0]).to.eq('1');
    expect(results[1]).to.eq('1');
    expect(results[2]).to.eq('0');
  });
});
