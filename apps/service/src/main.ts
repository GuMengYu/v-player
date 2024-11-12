import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as netEaseApi from 'NeteaseCloudMusicApi'

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
  await app.listen(process.env.PORT ?? 12141);
  await netEaseApi.serveNcmApi({
    port: 12140,
    host: '127.0.0.1',
  })
}
bootstrap();
