import { Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller("cont")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  home(@Req() request: Request, @Res() response: Response) {

    return 'this is home';
  }

  @Get("/get")
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/post")
  getHello2(): string {
    return this.appService.getHello();
  }

  @Get("/user/:userId")
    getHello3(@Param("userId") userId: string): string {
    return `${userId}, ` + this.appService.getHello() ;
  }

  @Get('/search')
  search(@Query('year') searchingYear: number) {
    return `We are Searching made after: ${searchingYear}`;
  }



}
