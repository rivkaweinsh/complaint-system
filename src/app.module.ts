import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@core/config/configuration';
import { ComplaintModule } from '@features/complaint/complaint.module';
import { RedisModule } from '@services/redis/redis.module';
import { SqsModule } from '@services/sqs/sqs.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    ComplaintModule,
    RedisModule,
    SqsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
