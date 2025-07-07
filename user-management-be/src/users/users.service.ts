import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  async update(id: number, dto: UpdateUserDto, currentUser: any) {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Only admins can edit users');
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }
}
