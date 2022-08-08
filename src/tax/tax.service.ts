import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as archive from 'archiver';
import { ConfigService } from '@nestjs/config';
import * as mime from 'mime';
import * as path from 'path';
import * as fs from 'fs';
import * as contentDisposition from 'content-disposition';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { Response } from 'express';
import { FileValidationDto } from './dto/user.dto';

@Injectable()
export class TaxService {

  constructor(private readonly userService: UserService,
              private readonly config: ConfigService) {}

  private readonly CCD ='H000'

  async download(userAgent: string, res:Response, year: string, empIds: string[]) {

    if(await this.isEmpty(empIds)) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'empIds cannot be empty',
      }, 403)
    }

    const FilePaths = await this.findFilePaths(year, empIds)

    const isValid = await this.validateFiles(year, FilePaths)

    if(!isValid.result){
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        data: isValid.hasInvalidFileArr,
        error: 'file not exist',
      }, 404)
    }

    if(await this.isMoreThanOneFile(empIds)){

      await this.zipFiles(userAgent, await this.setResponseHeader(userAgent, res, `${year}.zip`), year, FilePaths)
    }else{
      res = await this.setResponseHeader(userAgent, res, FilePaths[0])
      const filePath = FilePaths[0]
      this.hasFile(filePath)
      const filestream = fs.createReadStream(filePath);
      filestream.pipe(res);
    }
  }

  async findFilePaths(year: string, empIds: string[]): Promise<string[]> {
    let fileNameArr = []
    for await (let empId of empIds) {
      const filename = await this.userService.findFilePaths(this.CCD, empId)
      const path = `${this.config.get('ATTACH_SAVE_PATH')}/${year}/${filename}`
      fileNameArr.push(path)
    }
    return fileNameArr;
  }

  private async validateFiles(year: string, filePaths: string[] ): Promise<FileValidationDto> {
    let result = true
    let invalidFileArr = []
    for await (let filePath of filePaths) {
      if(!fs.existsSync(filePath)){
        result = false
        invalidFileArr.push(path.basename(filePath))
      }
    }
    return {
      result: result,
      hasInvalidFileArr: invalidFileArr
    }
  }

  private async zipFiles(userAgent: string, res: Response, year: string, filePaths: string[]):  Promise<void> {

    const zip = archive('zip');
    for await (let filePath of filePaths) {
        zip.file(filePath, {name: path.basename(filePath)})
    }

    zip.pipe(res)
    await zip.finalize()
  }

  private hasFile(filePath: string){
    if (fs.existsSync(filePath)) {
      //file exists

    }else{
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        data: path.basename(filePath),
        error: 'file not exist',
      }, 404)
    }
  }

  private async setResponseHeader(header: string,res: Response, fileName: string){
    const mimetype = mime.lookup(fileName)
    console.log(contentDisposition(fileName))
    res.setHeader('Access-Control-Expose-Headers', 'Content-disposition');
    res.setHeader('Content-disposition', contentDisposition(fileName))
    res.setHeader('Content-type', mimetype);
    return res;
  }

   private async isMoreThanOneFile(empIds: string[]): Promise<boolean> {

    return empIds.length > 1
  }

  private async isEmpty(empIds: string[]): Promise<boolean> {
    return empIds.length === 0 || empIds.length === undefined || empIds.length === null
  }

  async findFileNames (year: string, empIds: string[]): Promise<string[]> {
    let fileNameArr = []
    let filePathArr = await this.findFilePaths(year, empIds)
    for await (let filepath of filePathArr) {
      fileNameArr.push(path.basename(filepath))
    }
    return fileNameArr;
  }

}

