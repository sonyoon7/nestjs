import { Test, TestingModule } from '@nestjs/testing';
import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';
import { Logger } from '@nestjs/common';
import { UserModule } from '../user/user.module';

describe('AppController', () => {
  let taxController: TaxController;
  let taxService: TaxService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaxController],
      providers: [TaxService],
      imports: [UserModule]    }).compile();

    taxController = app.get<TaxController>(TaxController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      Logger.log(taxService.getHello2())
      expect(taxController.home()).toBe('Hello World!');
    });
  });
});
