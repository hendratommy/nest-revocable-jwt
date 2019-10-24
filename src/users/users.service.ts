import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        id: 1,
        username: 'user01',
        password: 'secret',
      },
      {
        id: 2,
        username: 'user02',
        password: 'secret',
      },
      {
        id: 3,
        username: 'user03',
        password: 'secret',
      },
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
