import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if(file.mimetype.match(/\/(jpg|jpeg|png)$/))
          cb(null, true);
        else
          cb(new Error('Apenas arquivos de imagem são permitidos'), false);
      },
    }),
  ],
  controllers: [UserController],
  providers:   [UserService, MailerService],
  exports:     [UserService]
})

export class UserModule {}