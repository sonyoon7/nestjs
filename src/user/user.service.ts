import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { getManager, Repository } from 'typeorm';
import { FileDto } from '../tax/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOne(cCd: string, empId: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        cCd,
        empId
      },
    });
  }
  async findAll(): Promise<string> {

    const users = await this.usersRepository.findAndCount()
    console.log(users)

    return ''
  }

  async findFilePaths(cCd: string, empId: string): Promise<string> {
    const entityManager = getManager();
    const user: Array<FileDto> = await entityManager.query(`
        SELECT  EMP_NM || '(' || SUBSTR(PKG_CRYPTO.F_GET_DEC_DATA(PER_NO),1,6) || ').pdf' AS fileName
        FROM PA1010
        WHERE C_CD = '${cCd}'
        AND EMP_ID = '${empId}'
    `)
    return user[0].FILENAME
  }

}
