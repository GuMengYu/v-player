import dayjs from 'dayjs'

export class Timer {
  private startedMilliseconds: number
  private stoppedMilliseconds: number

  public get elapsedMilliseconds(): number {
    return this.stoppedMilliseconds - this.startedMilliseconds
  }

  public start(): void {
    this.startedMilliseconds = dayjs().valueOf()
  }

  public stop(): void {
    this.stoppedMilliseconds = dayjs().valueOf()
  }
}
