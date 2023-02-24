import { useUnmount } from "@/hooks";

interface StackElement<T> {
  data: T,
  date: number,
}

type RollbackAction<T> = (stackElement: StackElement<T>) => void;

export class ActionsHistoryStack<D> {
  private stack: StackElement<D>[] = [];
  private readonly stackDepth: number = 0;
  private action: RollbackAction<D> = null;

  constructor(stackDepth: number = 30) {
    this.stackDepth = stackDepth;
    this.rollback = this.rollback.bind(this);
  }

  async rollback(): Promise<void> {
    if (this.stack.length) {
      const stackElement = this.stack.pop();
      await this.action(stackElement);
    }
  }

  append(data: D) {
    if (this.stack.length === this.stackDepth) {
      this.stack.shift();
    }
    this.stack.push({
      data,
      date: Date.now()
    });
  }

  public pop() {
    this.stack.pop();
  }

  public isEmpty() {
    return this.stack.length === 0;
  }

  private clearStack() {
    this.stack = [];
  }

  useUnmount() {
    useUnmount(() => this.clearStack());
  }

  useRollbackAction(action: RollbackAction<D>) {
    this.action = action;
  }
}