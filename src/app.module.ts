import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentairesModule } from './commentaires/commentaires.module';
import { TachesModule } from './taches/taches.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from "@nestjs/config";
import jwtConfig from './config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../src/auth/guard/jwt-auth.guard';


@Module({
  
  imports: [ 
      ConfigModule.forRoot({
      isGlobal: true, 
      load: [jwtConfig],
    }), AuthModule, UtilisateursModule, TachesModule, CommentairesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService ,
            {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
