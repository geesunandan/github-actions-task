import { Prisma, User } from '@prisma/client';

import dbClient from '@/config/database';

export type UserPayload = Prisma.UserCreateInput;
export type UserSchema = Omit<User, 'password'>;

export interface IUserRepository {
  createUser: (user: UserPayload) => Promise<UserSchema>;
  findByEmail: (email: string) => Promise<UserSchema | null>;
  findByEmailWithPassword: (email: string) => Promise<User | null>;
}

class UserRepository implements IUserRepository {
  async createUser(userPayload: UserPayload) {
    const createdUser = await dbClient.user.create({ data: userPayload });
    const { password, ...userInformation } = createdUser;

    return userInformation;
  }

  async findByEmail(email: string) {
    const user = await dbClient.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    const { password, ...userInformation } = user;

    return userInformation;
  }

  async findByEmailWithPassword(email: string) {
    const user = await dbClient.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    return user;
  }
}

export default UserRepository;
