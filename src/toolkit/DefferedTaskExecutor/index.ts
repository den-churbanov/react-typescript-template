import { Cb, ScheduledTaskContract, SchedulerKey } from './types';
import { noopAsyncFn, noopFn } from '@/helpers';

type PlannedTaskGetter = () => Promise<void>;

class ScheduledTask implements ScheduledTaskContract {
  private fired: boolean = false;
  private ref: number | null = null;
  private planned: PlannedTaskGetter;
  private cleanUpCb: Cb = noopFn;

  private constructor(
    planned: PlannedTaskGetter,
    timeout: number | null = null,
  ) {
    this.planned = async () => {
      await planned();
      this.destroy();
    }

    if (timeout !== null) {
      this.ref = window.setTimeout(this.planned, timeout);
    }
  };

  static nullValue = new ScheduledTask(noopAsyncFn);

  static schedule(planned: PlannedTaskGetter, timeout: number) {
    return new ScheduledTask(planned, timeout);
  };

  cleanUp(cb: Cb) {
    this.cleanUpCb = cb;
    return this;
  }

  async consumeTask(): Promise<void> {
    if (!this.fired) {
      await this.planned();
    }
  }

  destroy(): void {
    if (!this.fired) {
      window.clearTimeout(this.ref);
      this.fired = true;
      this.cleanUpCb();

      // Избавляемся от потенциальных утечек
      this.planned = noopAsyncFn;
      this.cleanUpCb = noopFn;
    }
  }
}

export class DeferredTaskExecutor {
  private readonly schedulers = new Map<SchedulerKey, ScheduledTaskContract>();

  scheduleTask(cb: PlannedTaskGetter, timeout: number, scheduleBy: SchedulerKey): ScheduledTaskContract {
    const got = this.schedulers.get(scheduleBy);

    const scheduled = ScheduledTask
      .schedule(cb, timeout)
      .cleanUp(() => this.schedulers.delete(scheduleBy));

    if (got) {
      got.destroy();
    }

    this.schedulers.set(scheduleBy, scheduled);
    return scheduled;
  }

  async forceScheduledTaskExecution(scheduledBy: SchedulerKey) {
    const scheduled = this.schedulers.get(scheduledBy);
    if (scheduled) {
      this.schedulers.delete(scheduledBy);

      await scheduled.consumeTask()
    }
  }

  async forceExecuteAll() {
    await Promise.all(Array.from(this.schedulers.keys()).map((key) => this.forceScheduledTaskExecution(key)))
  }
}

export * from './types';