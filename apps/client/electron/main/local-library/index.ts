import { NestFactory } from '@nestjs/core'
import type { MicroserviceOptions } from '@nestjs/microservices'
import { ElectronIpcTransport } from '@doubleshot/nest-electron'
import { AppModule } from './app.module'

export async function useLocalLibraryService() {
  const nestApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      strategy: new ElectronIpcTransport('IpcTransport'),
    },
  )
  await nestApp.listen()
}
