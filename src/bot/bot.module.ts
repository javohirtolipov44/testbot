import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.service';

@Module({
  providers: [BotUpdate],
})
export class BotModule {}
