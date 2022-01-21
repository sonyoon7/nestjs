import { Body, Controller, Headers, Param, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { TaxService } from './tax.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserDto } from './dto/user.dto';


@Controller("tax")
export class TaxController {
  constructor(private readonly taxService: TaxService,
              private config: ConfigService) {}

  @Post("/upload/:year")
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Param("year") year: string): string {
    console.log(files)

    return files.toString()
  }

  @Post("/download/:year")
  async downloadFiles(@Headers('User-Agent') headers,/*@Headers('user-agent') agent: string, */@Req() request: Request, @Res() response: Response, @Param("year") year: string, @Body() userDto: UserDto ) {
    // console.log(request.get( 'User-Agent'))
    await this.taxService.download(headers, response, year, userDto.empIds)

  }

}
