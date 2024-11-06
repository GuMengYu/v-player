import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as netEaseApi from 'NeteaseCloudMusicApi'
console.log(netEaseApi)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  await netEaseApi.serveNcmApi({
    port: 3001,
    host: '127.0.0.1',
  })
}
bootstrap();
