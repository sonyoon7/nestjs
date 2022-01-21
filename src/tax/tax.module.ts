import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';

import * as fs from 'fs';
import { TaxController } from '../tax/tax.controller';
import { TaxService } from './tax.service';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    // ConfigService 를 inject 하기 위해
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        storage: diskStorage({
          destination: function (req, file, cb) {
            // 파일저장위치 + 년월 에다 업로드 파일을 저장한다.
            // 요 부분을 원하는 데로 바꾸면 된다.

            const dest = `${config.get('ATTACH_SAVE_PATH')}/${req.body.year}/`;

            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }

            cb(null, dest);
          },
          filename: (req, file, cb) => {
            //파일명 같은 파일명이 있을 시 덮어쓰기 됨
            return cb(null, `${file.originalname}`);
          },
        }),
        limits: {
          // files: 10,                      //10개까지
          fileSize: 1024 * 1024 * 100    //한번 업로드 할때 최대 사이즈

        }
      }),
      inject: [ConfigService],
    }),
    UserModule
  ],
  controllers: [TaxController],
  providers:[TaxService, ConfigService]
})
export class TaxModule {}
