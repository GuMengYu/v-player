import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  public getTime(): number {
    return new Date().getTime()
  }
}
