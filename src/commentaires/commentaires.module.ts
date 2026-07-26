import { Module } from '@nestjs/common';
import { CommentairesService } from './commentaires.service';
import { CommentairesController } from './commentaires.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ PrismaModule],
  controllers: [CommentairesController],
  providers: [CommentairesService],
})
export class CommentairesModule {}
