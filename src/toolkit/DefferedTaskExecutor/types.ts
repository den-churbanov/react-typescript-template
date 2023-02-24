export type Cb = () => void;

export type SchedulerKey = number | string | null;

export interface ScheduledTaskContract {
  destroy(): void;
  consumeTask(): Promise<void>;
  cleanUp(cb: Cb): ScheduledTaskContract;
}